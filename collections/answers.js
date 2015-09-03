Answers = new Mongo.Collection('answers');

Meteor.methods({
  answerInsert: function(answerAttributes) {
    check(answerAttributes, {
      postId: String,
      body: String,
      isAnonymous: Boolean
    });

    if(Meteor.isServer){
      answerAttributes.body = purifyHTML(answerAttributes.body);
    }

    var user = Meteor.user();
    var now = new Date();

    if (!user)
    throw new Meteor.Error('invalid-user', 'You must be logged in to post an answer');

    var post = Posts.findOne(answerAttributes.postId);
    if (!post)
    throw new Meteor.Error('invalid-answer', 'You must answer on a post');

    var course = Courses.findOne(post.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

    //Checks if enrolled
    if(Meteor.users.findOne(user._id).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course');

    // UniHTML.addNewAllowedTag('code', false);
    // answerAttributes.body =  UniHTML.purify(answerAttributes.body, {withoutTags: ['em', 'blockquote', 'h1-h7', 'table']});

    // set identiconHash
    var identiconHash = answerAttributes.isAnonymous ? answerAttributes.postId + user._id : user._id;

    answer = _.extend(answerAttributes, {
      userId: user._id,
      userIdenticon: Package.sha.SHA256(identiconHash),
      upvoters: [],
      createdAt: now,
      updatedAt: now,
      comments: [],
      voteCount: 0,
      isDeleted: false
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

    //increments answers counts
    var postUpdateOptions = {
      $inc: {answersCount: 1},
    }

    // if first answer, add response time to post
    if (post.answersCount == 0) {
      var diff = Math.round(moment.duration(moment(now).diff(post.createdAt)).asMinutes());

      postUpdateOptions = _.extend(postUpdateOptions, {
        $set: {responseTime: diff}
      })
    }

    Posts.update({_id: answerAttributes.postId}, postUpdateOptions);

    //pulls user from users answering live
    LiveAnswers.update({postId: answerAttributes.postId}, {$pull: {usersLiveAnswering: user._id}});

    //delete any answer drafts
    Drafts.remove({postId: answerAttributes.postId, userId: user._id, type: "answer"});

    // create the answer, save the id
    answer._id = Answers.insert(answer);

    if(post.followers){
      post.followers.forEach(function(followerId) {
        if(followerId != Meteor.userId()){
          var answerBodyWithoutTags = UniHTML.purify(answerAttributes.body, {withoutTags: ['b', 'img', 'i', 'u', 'br', 'pre', 'p', 'span', 'div', 'a', 'li', 'ul', 'ol', 'h1-h7']});

          var notificationAttributes = {
            intend: 'New answer added to: ',
            postTitle: post.title,
            text: answerBodyWithoutTags,
            type: 'answerToPost',
            answerId: answer._id,
            postId: post._id,
            postCourseId: post.courseId,
            userId: followerId,
            seen: false
          }

          Meteor.call("addNotification", notificationAttributes);

          var answerUrl = 'https://test-ask.giovannialcantara.com/room/' + course._id +'?p=' + post._id +"#"+ answer._id;
          var tempUrl = 'https://test-ask.giovannialcantara.com/room/' + course._id +'?p=' + post._id;


          var emailBody = '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="33" style="border-collapse:collapse;padding:0">&nbsp;</td></tr></table><table width="600" cellpadding="0" cellspacing="0" class="invert" bgcolor="#353535" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> <tr style="padding:0"> <td height="40" width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> <td valign="middle" align="left" style="border-collapse:collapse;padding:0"> <!-- CONTENT start --> <div class="h" style="color:#FAFAFA;background-color:#353535;line-height:1;margin:0;height:20px"><div style="color:#FAFAFA;background-color:#353535;line-height:1;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:0px;margin-bottom:6px;margin-top:10px;margin:0;height:20px"><a href="'+tempUrl+'" style="text-decoration:none;color:inherit;">'+ post.title +'</a></div></div> <!-- CONTENT end --> </td> <td width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> </tr> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> </table>';
          emailBody += '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="30" align="right" valign="top" class="small" style="border-collapse:collapse;padding:0"><div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px"></div></td></tr></table> <!-- 1/3 Image on the Left start --><table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td valign="top" style="border-collapse:collapse;padding:0"> <table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td width="20" style="border-collapse:collapse;padding:0">&nbsp;</td> <td width="393" valign="top" align="left" style="border-collapse:collapse;padding:0"> <div class="h" style="color:#787878;line-height:20px"><div style="color:#444444;line-height:24px;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:-2px;margin-bottom:6px;margin-top:10px"><a href="'+answerUrl +'" style="color: inherit;text-decoration:none;letter-spacing:-1px;">Answer<span style="margin-left: 10px;letter-spacing: -1px;font-weight:300;font-size:70%; color: #888"> '+ moment(now).format('MMMM Do YYYY, H:mm:ss') +' </span></a></div></div> <div style="color:#787878;line-height:20px">'+answerBodyWithoutTags+'</div> </td> <!-- CONTENT end --> </tr></table> </td> </tr></table> <!-- 1/3 Image on the Left end -->';

          var emailAttributes = {"emailBody": emailBody, "recipient": "martingeorgiev1995@gmail.com", "subject": '"' +post.title + '" has been answered'  };

          Meteor.call("emailSend", emailAttributes, function(error, result){
            if(error){
              console.log("error", error);
            }
            if(result){

            }
          });
        }
      });
    }


    return answer._id;
  },
  saveAnswerDraft: function(answerAttributes) {
    check(answerAttributes, {
      body: String,
      postId: String
    });

    var userId = Meteor.userId();
    if (!userId)
    throw new Meteor.Error('invalid-user', 'You must be logged in to edit an answer');

    var post = Posts.findOne(answerAttributes.postId);
    if (!post)
    throw new Meteor.Error('invalid-answer', 'The post does not exist');

    var course = Courses.findOne(post.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

    //Checks if enrolled
    if(Meteor.users.findOne(userId).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course');

    if(Meteor.isServer){
      answerAttributes.body = purifyHTML(answerAttributes.body);
    }
    Drafts.update({postId: answerAttributes.postId, userId: userId, type: "answer"}, {$set: {body: answerAttributes.body}}, {upsert: true});

    return true;
  },
  answerUpdate: function(answerAttributes) {
    check(answerAttributes, {
      answerId: String,
      postId: String,
      body: String,
      isAnonymous: Boolean
    });

    var user = Meteor.user();

    if (!user)
    throw new Meteor.Error('invalid-user', 'You must be logged in to edit an answer');

    var post = Posts.findOne(answerAttributes.postId);
    if (!post)
    throw new Meteor.Error('invalid-answer', 'You must answer on a post');

    var answer = Answers.findOne({_id: answerAttributes.answerId});
    if (!answer)
    throw new Meteor.Error('invalid-answer', 'The answer you\'re trying to edit does not exist');

    if (answer.userId != Meteor.userId())
    throw new Meteor.Error('invalid-permission', 'You need to be the owner of an answer you want to edit');

    var course = Courses.findOne(post.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

    //Checks if enrolled
    if(Meteor.users.findOne(user._id).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course');

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
    );

    var answerNotifications = Notifications.find({"answerId": answerAttributes.answerId, "type": 'answerToPost'});
    var commentNotifications = Notifications.find({"answerId": answerAttributes.answerId, "type": 'commentToAnswer'});
    if(Meteor.isServer){
      var answerBodyWithoutTags = purifyHTML(answerAttributes.body);
    }
    var post = Posts.findOne(answerAttributes.postId);

    answerNotifications.forEach(function(notification) {
      Notifications.update({_id: notification._id}, {$set:{
        postTitle: post.title,
        text: answerBodyWithoutTags,
      }});
    });

    commentNotifications.forEach(function(notification) {
      Notifications.update({_id: notification._id}, {$set:{
        postTitle: answerBodyWithoutTags
      }});
    });

    return answerAttributes.answerId;
  },
  commentUpdate: function(commentAttributes) {
    check(commentAttributes, {
      answerId: String,
      commentId: String,
      postId: String,
      body: String,
      isAnonymous: Boolean
    });

    var user = Meteor.user();
    if (!user)
    throw new Meteor.Error('invalid-user', 'You must be logged in to edit a comment');

    var post = Posts.findOne(commentAttributes.postId);
    if (!post)
    throw new Meteor.Error('invalid-answer', 'You must answer on a post');

    var course = Courses.findOne(post.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

    //Checks if enrolled
    if(Meteor.users.findOne(user._id).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course');

    var answer = Answers.findOne({_id: commentAttributes.answerId});
    if (!answer)
    throw new Meteor.Error('invalid-answer', "The comment should belong to an answer");

    // set identiconHash
    var identiconHash = commentAttributes.isAnonymous ? commentAttributes.postId + user._id : user._id;
    var now = new Date();
    if(Meteor.isServer){
      commentAttributes.body = purifyHTML(commentAttributes.body);
    }
    Answers.update(
      {
        "_id": commentAttributes.answerId,
        "comments._id": commentAttributes.commentId
      },
      {
        $set: {
          "comments.$.body": commentAttributes.body,
          "comments.$.isAnonymous": commentAttributes.isAnonymous,
          "comments.$.userIdenticon": Package.sha.SHA256(identiconHash),
          "comments.$.updatedAt": now
        }
      }
    );

    // var commentNotifications = Notifications.find({"answerId": commentAttributes.answerId, "type": 'commentToAnswer'});
    // var commentBodyWithoutTags = UniHTML.purify(commentAttributes.body, {withoutTags: ['b', 'img', 'i', 'u', 'br', 'pre', 'p', 'span', 'div', 'a', 'li', 'ul', 'ol', 'h1-h7']});
    //
    // commentNotifications.forEach(function(notification) {
    //     Notifications.update({_id: notification._id}, {$set:{
    //       postTitle: commentBodyWithoutTags
    //     }});
    //   });

    return commentAttributes.commentId;
  },
  commentInsert: function(commentAttributes) {
    check(commentAttributes, {
      answerId: String,
      body: String,
      isAnonymous: Boolean
    });

    if(Meteor.isServer){
      commentAttributes.body = purifyHTML(commentAttributes.body);
    }

    var user = Meteor.user();
    if(!user)
    throw new Meteor.Error('invalid-user', 'You must be logged in to insert a comment');

    var answer = Answers.findOne(commentAttributes.answerId);

    if (!answer)
    throw new Meteor.Error('invalid-comment', 'You must comment on an answer');

    var post = Posts.findOne(answer.postId);
    if (!post)
    throw new Meteor.Error('invalid-post', 'You comment must belong to answer in a post');

    var course = Courses.findOne(post.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'You comment must belong to answer in a post in a course');

    //Checks if enrolled
    if(Meteor.users.findOne(user._id).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course');

    // set identiconHash
    var identiconHash = commentAttributes.isAnonymous ? answer.postId + user._id : user._id;

    comment = _.extend(commentAttributes, {
      _id: new Meteor.Collection.ObjectID()._str,
      userId: user._id,
      userIdenticon: Package.sha.SHA256(identiconHash),
      //author: user.username,
      createdAt: new Date(),
      updatedAt: new Date(),
      postId: answer.postId,
      isInstructor: course.instructors.indexOf(user.username) != -1
    });

    // create the answer, save the id
    Answers.update({_id: commentAttributes.answerId}, {$addToSet : {
      "comments": comment
    }});

    if(answer.userId && (answer.userId != user._id)){
      var commentBodyWithoutTags="",answerBodyWithoutTags="";
      if(Meteor.isServer){
        commentBodyWithoutTags = sanitizeHtml(commentAttributes.body, {allowedTags: []});
        answerBodyWithoutTags =  sanitizeHtml(answer.body, {allowedTags: []});
      }

      var notificationAttributes = {
        intend: 'New comment to answer: ',
        postTitle: answerBodyWithoutTags,
        text: commentBodyWithoutTags,
        type: 'commentToAnswer',
        answerId: answer._id,
        postId: post._id,
        postCourseId: post.courseId,
        userId: answer.userId,
        seen: false
      }

      Meteor.call("addNotification", notificationAttributes);
    }

    return true;
  },
  answerVote: function(answerId) {
    check(answerId, String);

    var userId = Meteor.userId();
    if(!userId)
    throw new Meteor.Error('invalid-user', 'You must be logged in to upvote an answer');

    var answer = Answers.findOne(answerId);

    if(userId == answer.userId){
      throw new Meteor.Error('invalid-permission', 'You cannot upvote your answer');
    }

    if (!answer) {
      throw new Meteor.Error('invalid-answer', 'You must vote on an answer');
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
    check(answerId, String);

    var userId = Meteor.userId();
    if(!userId)
    throw new Meteor.Error('invalid-user', 'You must be logged in to delete an answer');

    var answer = Answers.findOne(answerId);

    var hasPermission;
    var post = Posts.findOne(answer.postId);

    if (answer) {
      if(answer.isAnonymous) {
        if (post) {
          hasPermission = answer.userIdenticon == Package.sha.SHA256(post._id + userId);
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

      // decrease answer count
      var postUpdateOptions = {
        $inc: {answersCount: -1}
      };

      // if only answers, unset post response time
      if (post.answersCount == 1) {
        postUpdateOptions = _.extend(postUpdateOptions, {
          $unset: {responseTime: ""}
        })
      } else {
        // set response time to second answer's diff, if this answer is the first
        var firstTwoAnswers = Answers.find({postId: answer.postId, isDeleted: false},{limit: 2, sort: {createdAt:1}}).fetch();
        if (firstTwoAnswers[0]._id == answerId) {
          var diff = Math.round(moment.duration(moment(firstTwoAnswers[1].createdAt).diff(post.createdAt)).asMinutes());

          postUpdateOptions = _.extend(postUpdateOptions, {
            $set: {responseTime: diff}
          })
        }
      }

      if(answer.isInstructor){
        if(Answers.find({postId: answer.postId, isDeleted: false, isInstructor: true}).count() == 1){
          Posts.update({_id: answer.postId}, {
            $unset: {'badges.hasInstructorAnswer': true}
          });
        }
      }else{
        if(Answers.find({postId: answer.postId, isDeleted: false, isInstructor: {$ne: true}}).count() == 1){
          Posts.update({_id: answer.postId}, {
            $unset: {'badges.hasStudentAnswer': true}
          });
        }
      }

      Posts.update({_id: answer.postId}, postUpdateOptions);

      // delete answer
      Answers.update({_id: answerId}, {$set : {
        "isDeleted": true
      }});

    } else {
      throw new Meteor.Error('invalid-delete-permission', 'You don\'t have permission to delete this answer!');
    }
  },
  commentDelete: function(answerId, commentId) {
    check(answerId, String);
    check(commentId, String);

    var userId = Meteor.userId();
    if(!userId)
    throw new Meteor.Error('invalid-user', 'You must be logged in to delete a comment');

    var answer = Answers.findOne(answerId);

    var hasPermission;
    var post = Posts.findOne(answer.postId);

    if (answer) {
      var comment = _.find(answer.comments, function(comment){
        if (comment._id == commentId) return true;
      });

      if (comment) {
        if(comment.isAnonymous) {
          if (post) {
            hasPermission = comment.userIdenticon == Package.sha.SHA256(post._id + userId)
          } else {
            throw new Meteor.Error('invalid-post', 'The comment you\'re trying to delete must belong to a post');
          }
        } else {
          hasPermission = comment.userId == userId;
        }
      } else {
        throw new Meteor.Error('invalid-comment', 'The comment you\'re trying to delete does not exist');
      }
    } else {
      throw new Meteor.Error('invalid-answer', 'The comment you\'re trying to delete does not belong to a post');
    }

    if(hasPermission){

      Answers.update(
        {
          "_id": answerId,
          "comments._id": commentId
        },
        {
          $pull: {comments: {
            _id: commentId
          }}
        }
      )
    } else {
      throw new Meteor.Error('invalid-delete-permission', 'You don\'t have permission to delete this comment!');
    }
  }
});
