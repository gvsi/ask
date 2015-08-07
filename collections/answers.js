Answers = new Mongo.Collection('answers');

Meteor.methods({
  answerInsert: function(answerAttributes) {
    answerAttributes.body = UniHTML.purify(answerAttributes.body);

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

    var course = Courses.findOne(post.course_id);
    if (!course)
      throw new Meteor.Error('invalid-course', 'This post does not belong to any course');


    // set identiconHash
    var identiconHash = answerAttributes.isAnonymous ? answerAttributes.postId + user._id : user._id;

    answer = _.extend(answerAttributes, {
      userId: user._id,
      ownerIdenticon: Package.sha.SHA256(identiconHash),
      //author: user.username,
      upvoters: [],
      downvoters: [],
      created_at: new Date(),
      updated_at: new Date(),
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
          $inc: {answersCount: 1},
          $set: {'badges.hasInstructorAnswer': true}
        });
      }
    } else {
      //updates the post to be student-answered if not set already
      if (!post.badges || (post.badges && !post.badges.hasStudentAnswer)) {
        Posts.update({_id: answerAttributes.postId}, {
          $inc: {answersCount: 1},
          $set: {'badges.hasStudentAnswer': true}
        });
      }
    }

    // create the answer, save the id
    answer._id = Answers.insert(answer);

    post.followers.forEach(function(followerId) {
      if(followerId != Meteor.userId()){
        var notificationAttributes = {
          intend: 'New answer added to: ',
          postTitle: post.title,
          text: answerAttributes.body,
          type: 'info',
          userId: followerId,
          link: '/'+ post.course_id + '/room?p=' + post._id + '#' + answer._id,
          seen: false
        }

        Meteor.call("addNotification", notificationAttributes);
     }
    });


    // TODO: now create a notification, informing the user that there's been a answer

    return answer._id;
  },
  answerUpdate: function(answerAttributes) {
    answerAttributes.body = UniHTML.purify(answerAttributes.body);

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
      var identiconHash = answerAttributes.isAnonymous ? answerAttributes.postId + answer.userId : answer.userId;
      var now = new Date();
      Answers.update(
        {_id: answerAttributes.answerId},
        {
          $set: {
            body: answerAttributes.body,
            isAnonymous: answerAttributes.isAnonymous,
            ownerIdenticon: Package.sha.SHA256(identiconHash),
            updated_at: now
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
    commentAttributes.body = UniHTML.purify(commentAttributes.body);

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
      ownerIdenticon: Package.sha.SHA256(identiconHash),
      //author: user.username,
      created_at: new Date(),
      updated_at: new Date(),
    });

    // create the answer, save the id
    Answers.update({_id: commentAttributes.answerId}, {$addToSet : {
      "comments": comment
    }});

    // TODO: now create a notification, informing the user that there's been a answer

    return true;
  },
  answerVote: function(voteAttributes) {

    check(voteAttributes, {
      answerId: String,
      isUpvote: Boolean
    });

    var userId = Meteor.userId();
    var answer = Answers.findOne(voteAttributes.answerId);

    if (!answer)
      throw new Meteor.Error('invalid-answer', 'You must answer on a post');

    var post = Posts.findOne(answer.postId);
    var course;

    if(post){
        course = Courses.findOne(post.course_id);
        if(!course)
            throw new Meteor.Error('invalid-course', 'The post must belong to a course');
    }else{
        throw new Meteor.Error('invalid-post', 'The answer must belong to a post');
    }

      var upVoters = answer.upvoters;
      var downVoters = answer.downvoters;

      if(upVoters.indexOf(userId) != -1){ //It was already upvoted by the user
          if(voteAttributes.isUpvote){
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: -1},
              $pull : {"upvoters": userId}
            });
          }else{
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: -1},
              $pull : {"upvoters": userId}
            });
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: -1},
              $addToSet : {"downvoters": userId}
            });
          }

          if(course.instructors.indexOf(Meteor.user().username) != -1){
            Answers.update({_id: voteAttributes.answerId},{
              $set: {
                  isInstructorUpvoted: false
              }
            });
          }

      }else if (downVoters.indexOf(userId) != -1) { //It was already downvoted by the user
          if(voteAttributes.isUpvote){
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: 1},
              $pull : {"downvoters": userId }
            });
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: 1},
              $addToSet : {"upvoters": userId}
            });

            if(course.instructors.indexOf(Meteor.user().username) != -1){
              Answers.update({_id: voteAttributes.answerId},{
                $set: {
                    isInstructorUpvoted: true
                }
              });
            }

          }else{
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: 1},
              $pull : {"downvoters": userId }
            });
          }
      }else{
          if(voteAttributes.isUpvote){
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: 1},
              $addToSet : {"upvoters": userId}
            });

            if(course.instructors.indexOf(Meteor.user().username) != -1){
              Answers.update({_id: voteAttributes.answerId},{
                $set: {
                    isInstructorUpvoted: true
                }
              });
            }

          }else{
            Answers.update({_id: voteAttributes.answerId},{
              $inc: {voteCount: -1},
              $addToSet : {"downvoters": userId}
            });
          }
      }

      var newAnswer = Answers.findOne(voteAttributes.answerId);
      return newAnswer.upvoters.length - newAnswer.downvoters.length;
  },
  answerDelete: function(answerId){
      var userId = Meteor.user()._id;
      var answer = Answers.findOne(answerId);

      if(userId == answer.userId){
        Answers.update({_id: answer._id}, {$set : {
          "isDeleted": true
        }});
      }
  }
});
