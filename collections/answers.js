Answers = new Mongo.Collection('answers', {
  transform: function(doc) {
    if (doc.isAnonymous) {
      delete doc.userId;
    }
    doc.comments.forEach(function(comment){
      if (comment.isAnonymous) {
        delete comment.userId;
      }
    });
    return doc;
  }
});

Meteor.methods({
  answerInsert: function(answerAttributes) {
    //UniHTML.addNewAllowedTag("code", false);
    //answerAttributes.body = UniHTML.purify(answerAttributes.body);

    check(answerAttributes, {
      postId: String,
      body: String,
      isAnonymous: Boolean
    });

    var user = Meteor.user();

    if (!user)
    throw new Meteor.Error('invalid-user', 'You must be logged in to post an answer');

    var post = Posts.findOne(answerAttributes.postId);
    if (!post)
    throw new Meteor.Error('invalid-answer', 'You must answer on a post');

    var course = Courses.findOne(post.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');


    // set identiconHash
    var identiconHash = answerAttributes.isAnonymous ? answerAttributes.postId + user._id : user._id;

    answer = _.extend(answerAttributes, {
      userId: user._id,
      userIdenticon: Package.sha.SHA256(identiconHash),
      //author: user.username,
      upvoters: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      comments: [],
      voteCount: 0
    });


    var un = user.username.toLowerCase();

    // checks if it's an instructor answer
    if(course.instructors.indexOf(un) != -1){
      //marks answer as instructor answer
      answer = _.extend(answerAttributes, {
        isInstructor: true
      });

      //updates the post to be instructor-answered if not set already
      if (!post.badges || (post.badges && !post.badges.hasInstructorAnswer)) {
        Posts.update({_id: answerAttributes.postId}, {
          $set: {'badges.hasInstructorAnswer': true}
        });
      }
    } else {
      //updates the post to be student-answered if not set already
      if (!post.badges || (post.badges && !post.badges.hasStudentAnswer)) {
        Posts.update({_id: answerAttributes.postId}, {
          $set: {'badges.hasStudentAnswer': true}
        });
      }
    }

    Posts.update({_id: answerAttributes.postId}, {
      $inc: {answersCount: 1}
    });

    // create the answer, save the id
    answer._id = Answers.insert(answer);

    if(post.followers){
      post.followers.forEach(function(followerId) {
        if(followerId != Meteor.userId()){
          var notificationAttributes = {
            intend: 'New answer added to: ',
            postTitle: post.title,
            text: answerAttributes.body,
            type: 'info',
            userId: followerId,
            link: '/room/'+ post.courseId + '?p=' + post._id + '#' + answer._id,
            seen: false
          }

          Meteor.call("addNotification", notificationAttributes);
        }
      });
    }

    return answer._id;
  },
  answerUpdate: function(answerAttributes) {
    //answerAttributes.body = UniHTML.purify(answerAttributes.body);

    var user = Meteor.user();

    if (!user)
    throw new Meteor.Error('invalid-user', 'You must be logged in to edit an answer');

    check(answerAttributes, {
      answerId: String,
      postId: String,
      body: String,
      isAnonymous: Boolean
    });

    var answer = Answers.findOne({_id: answerAttributes.answerId});
    //check existance of post to update
    if (answer) {
      // set identiconHash
      var identiconHash = answerAttributes.isAnonymous ? answerAttributes.postId + user._id : user._id;
      var now = new Date();
      Answers.update(
        {_id: answerAttributes.answerId},
        {
          $set: {
            body: answerAttributes.body,
            isAnonymous: answerAttributes.isAnonymous,
            userIdenticon: Package.sha.SHA256(identiconHash),
            updatedAt: now
          },
          // adds to revision history
          $addToSet: {
            revisionHistory: {
              revisionDate: now,
              body: answerAttributes.body,
              isAnonymous: answerAttributes.isAnonymous,
            }
          }
        }
      )
    } else {
      throw new Meteor.Error('invalid-answer', 'The answer you\'re trying to edit does not exist');
    }

    // TODO: now create a notification, informing the user that there's been a answer

    return answerAttributes.answerId;
  },
  commentInsert: function(commentAttributes) {
    //commentAttributes.body = UniHTML.purify(commentAttributes.body);

    check(commentAttributes, {
      answerId: String,
      body: String,
      isAnonymous: Boolean
    });

    var user = Meteor.user();
    var answer = Answers.findOne(commentAttributes.answerId);

    if (!answer)
    throw new Meteor.Error('invalid-comment', 'You must comment on an answer');

    // set identiconHash
    var identiconHash = commentAttributes.isAnonymous ? answer.postId + user._id : user._id;

    comment = _.extend(commentAttributes, {
      userId: user._id,
      userIdenticon: Package.sha.SHA256(identiconHash),
      //author: user.username,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // create the answer, save the id
    Answers.update({_id: commentAttributes.answerId}, {$addToSet : {
      "comments": comment
    }});

    if(answer.userId && (answer.userId != user._id)){
      var post = Posts.findOne(answer.postId);
      var commentBodyWithoutTags = UniHTML.purify(commentAttributes.body, {withoutTags: ['b', 'img', 'i', 'u', 'br', 'pre', 'p', 'span', 'div', 'a', 'li', 'ul', 'ol', 'h1-h7']});
      var answerBodyWithoutTags = UniHTML.purify(answer.body, {withoutTags: ['b', 'img', 'i', 'u', 'br', 'pre', 'p', 'span', 'div', 'a', 'li', 'ul', 'ol', 'h1-h7']});
      var notificationAttributes = {
        intend: 'New comment to answer: ',
        postTitle: answerBodyWithoutTags,
        text: commentBodyWithoutTags,
        type: 'info',
        userId: answer.userId,
        link: '/room/'+ post.courseId + '?p=' + post._id + '#' + answer._id,
        seen: false
      }

      Meteor.call("addNotification", notificationAttributes);
    }

    return true;
  },
  answerVote: function(answerId) {
    check(answerId, String);

    var userId = Meteor.userId();
    var answer = Answers.findOne(answerId);

    if (!answer) {
      throw new Meteor.Error('invalid-answer', 'You must answer on a post');
    }

    var post = Posts.findOne(answer.postId);
    var course;

    if (post) {
      course = Courses.findOne(post.courseId);
      if(!course)
      throw new Meteor.Error('invalid-course', 'The post must belong to a course');
    } else {
      throw new Meteor.Error('invalid-post', 'The answer must belong to a post');
    }

    if(answer.upvoters){
        var upVoters = answer.upvoters;

        if (upVoters.indexOf(userId) != -1) { //It was already upvoted by the user
          Answers.update({_id: answerId},{
            $inc: {voteCount: -1},
            $pull : {"upvoters": userId}
          });

          if (course.instructors.indexOf(Meteor.user().username) != -1) {
            Answers.update({_id: answerId},{
              $set: {
                isInstructorUpvoted: false
              }
            });
          }
        } else {
          Answers.update({_id: answerId},{
            $inc: {voteCount: 1},
            $addToSet : {"upvoters": userId}
          });

          if (course.instructors.indexOf(Meteor.user().username) != -1) {
            Answers.update({_id: answerId},{
              $set: {
                isInstructorUpvoted: true
              }
            });
          }
        }
    }
  },
  answerDelete: function(answerId) {
    var userId = Meteor.user()._id;
    var answer = Answers.findOne(answerId);

    var hasPermission;

    if (answer) {
      if(answer.isAnonymous) {
        var post = Posts.findOne(answer.postId);
        if (post) {
          hasPermission = answer.userIdenticon == Package.sha.SHA256(post._id + userId)
        } else {
          throw new Meteor.Error('invalid-post', 'The answer you\'re trying to delete must belong to a post');
        }
      } else {
        hasPermission = answer.userId == userId;
      }
    } else {
      throw new Meteor.Error('invalid-answer', 'The answer you\'re trying to delete does not exist');
    }

    if(hasPermission){
      Answers.update({_id: answerId}, {$set : {
        "isDeleted": true
      }});
    } else {
      throw new Meteor.Error('invalid-delete-permission', 'You don\'t have permission to delete this answer!');
    }
  }
});
