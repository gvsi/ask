Posts = new Mongo.Collection('posts');
Drafts = new Mongo.Collection('drafts');
LiveAnswers = new Mongo.Collection('liveAnswers');

Meteor.methods({
  postInsert: function(postAttributes) {
    check(postAttributes, {
      title: String,
      text: String,
      tags: Array,
      isAnonymous: Boolean,
      courseId: String
    });

    var userId = Meteor.userId();
    var now = new Date();

    if (!userId) {
      throw new Meteor.Error('invalid-permission', 'You must be logged in to post');
    }

    var course = Courses.findOne(postAttributes.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

    //Checks if enrolled
    if(Meteor.users.findOne(userId).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course to ask a question');

    var post = _.extend(postAttributes, {
      userId: userId,
      createdAt: now,
      updatedAt: now,
      answersCount: 0,
      upvotesCount: 0,
      upvoters: [],
      isDeleted: false,
      followers: [userId],
      viewers: [userId],
      viewCount: 1
    });

    var notificationText = "";
    if(Meteor.isServer){
      postAttributes.text = purifyHTML(postAttributes.text);
      notificationText = sanitizeHtml(postAttributes.text, {allowedTags: []});
      postAttributes.title = sanitizeHtml(postAttributes.title, {allowedTags: []});
    }

    var un = Meteor.user().username.toLowerCase();
    if(course.instructors.indexOf(un) != -1){
      post = _.extend(postAttributes, {
        badges: { isInstructorPost: true },
        isInstructorPost: true
      });
    }

    var postId = Posts.insert(post);

    //delete any answer drafts
    Drafts.remove({courseId: postAttributes.courseId, userId: userId, type: "post"});

    var courseStudents = Meteor.users.find({"profile.courses": postAttributes.courseId});

    courseStudents.forEach(function(courseUser) {
      if(courseUser._id != userId){
        if(course.instructors.indexOf(un) != -1){

          var notificationAttributes = {
            intend: 'New instructor\'s note: ',
            postTitle: postAttributes.title,
            text: notificationText,
            type: 'instructorNote',
            answerId: "",
            postId: postId,
            postCourseId: postAttributes.courseId,
            userId: courseUser._id,
            seen: false
          }

          Meteor.call("addNotification", notificationAttributes);
        }

        if(courseUser.profile.emailPreferences == 'realTime'){
          var tempUrl = 'https://test-ask.giovannialcantara.com/room/' + course._id +'?p=' + postId;
          var courseUrl = 'https://test-ask.giovannialcantara.com/room/' + course._id;
          var emailBody = '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="33" style="border-collapse:collapse;padding:0">&nbsp;</td></tr></table><table width="600" cellpadding="0" cellspacing="0" class="invert" bgcolor="#353535" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> <tr style="padding:0"> <td height="40" width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> <td valign="middle" align="left" style="border-collapse:collapse;padding:0"> <!-- CONTENT start --> <div class="h" style="color:#FAFAFA;background-color:#353535;line-height:1;margin:0;height:20px"><div style="color:#FAFAFA;background-color:#353535;line-height:1;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:0px;margin-bottom:6px;margin-top:10px;margin:0;height:20px">New question in <a href="'+courseUrl+'" style="text-decoration:none;color:inherit;">"'+ course.name +'"</a></div></div> <!-- CONTENT end --> </td> <td width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> </tr> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> </table>';
          emailBody += '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="30" align="right" valign="top" class="small" style="border-collapse:collapse;padding:0"><div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px"></div></td></tr></table> <!-- 1/3 Image on the Left start --><table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td valign="top" style="border-collapse:collapse;padding:0"> <table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td width="20" style="border-collapse:collapse;padding:0">&nbsp;</td> <td width="393" valign="top" align="left" style="border-collapse:collapse;padding:0"> <div class="h" style="color:#787878;line-height:20px"><div style="color:#444444;line-height:24px;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:-2px;margin-bottom:6px;margin-top:10px"><a href="'+tempUrl +'" style="color: inherit;text-decoration:none;letter-spacing:-1px;">'+ postAttributes.title +'<span style="margin-left: 10px;letter-spacing: -1px;font-weight:300;font-size:70%; color: #888"> '+ moment(now).format('MMMM Do YYYY, H:mm:ss') +' </span></a></div></div> <div style="color:#787878;line-height:20px">'+postAttributes.text+'</div> </td> <!-- CONTENT end --> </tr></table> </td> </tr></table> <!-- 1/3 Image on the Left end -->';

          var emailAttributes = {"emailBody": emailBody, "recipient": "martingeorgiev1995@gmail.com", "subject": "New Question in "+course.name  };

          Meteor.call("emailSend", emailAttributes, function(error, result){
            if(error){
              console.log("error", error);
            }
            if(result){

            }
          });
        }
      }
    });


    // set identiconHash
    var identiconHash = postAttributes.isAnonymous ? postId + postAttributes.userId : postAttributes.userId;
    Posts.update({_id: postId}, {$set: {userIdenticon: Package.sha.SHA256(identiconHash)}})

    // save in revisionHistory
    Posts.update({_id: postId}, {
      $addToSet: {
        revisionHistory: {
          revisionDate: now,
          title: postAttributes.title,
          text: postAttributes.text,
          isAnonymous: postAttributes.isAnonymous,
          tags: postAttributes.tags
        }
      }
    });

    return {
      _id: postId
    };
  },
  postUpdate: function(postAttributes) {
    check(postAttributes, {
      postId: String,
      title: String,
      text: String,
      tags: Array,
      courseId: String,
      isAnonymous: Boolean
    });

    var userId = Meteor.userId();

    if (!userId) {
      throw new Meteor.Error('invalid-user', 'You must be logged in to update a post');
    }

    var post = Posts.findOne(postAttributes.postId);
    if (!post)
    throw new Meteor.Error('invalid-post', 'The post you are trying to update does not exist');

    if (post.userId != userId)
    throw new Meteor.Error('invalid-permission', 'You need to be the owner of the post you want to edit');

    // set identiconHash
    var identiconHash = postAttributes.isAnonymous ? postAttributes.postId + userId : userId;

    var notificationText = "";
    if(Meteor.isServer){
      postAttributes.text = purifyHTML(postAttributes.text);
      notificationText = sanitizeHtml(postAttributes.text, {allowedTags: []});
      postAttributes.title = sanitizeHtml(postAttributes.title, {allowedTags: []});
    }

    var now = new Date();
    Posts.update(
      {_id: postAttributes.postId},
      {
        $set: {
          title: postAttributes.title,
          text: postAttributes.text,
          isAnonymous: postAttributes.isAnonymous,
          tags: postAttributes.tags,
          userIdenticon: Package.sha.SHA256(identiconHash),
          updatedAt: now
        },
        // adds to revision history
        $addToSet: {
          revisionHistory: {
            revisionDate: now,
            title: postAttributes.title,
            text: postAttributes.text,
            isAnonymous: postAttributes.isAnonymous,
            tags: postAttributes.tags
          }
        }
      }
    )

    var answerNotifications = Notifications.find({"postId": postAttributes.postId, "type": 'answerToPost'});
    answerNotifications.forEach(function(notification) {
      Notifications.update({_id: notification._id}, {$set:{
        postTitle: postAttributes.title,
      }});
    });

    var course = Courses.findOne(postAttributes.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

    if(course.instructors.indexOf(Meteor.user().username.toLowerCase()) != -1){
      var noteNotifications = Notifications.find({"postId": postAttributes.postId, "type": 'instructorNote'});

      noteNotifications.forEach(function(notification) {
        Notifications.update({_id: notification._id}, {$set:{
          postTitle: postAttributes.title,
          text: notificationText,
        }});
      });
    }

    return {
      _id: postAttributes.postId
    };

  },
  savePostDraft: function(postAttributes) {
    check(postAttributes, {
      title: String,
      body: String,
      courseId: String
    });

    var userId = Meteor.userId();
    if (!userId)
    throw new Meteor.Error('invalid-user', 'You must be logged in to save a post draft');

    var course = Courses.findOne(postAttributes.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This course you are trying to save a draft for does not exist');

    //Checks if enrolled
    if(Meteor.users.findOne(userId).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course to save a draft');

    Drafts.update({courseId: postAttributes.courseId, userId: userId, type: "post"}, {$set: {body: postAttributes.body, title: postAttributes.title}}, {upsert: true});

    return true;
  },
  upvotePost: function(postId){
    check(postId, String);

    var userId = Meteor.userId();
    if (!userId)
    throw new Meteor.Error('invalid-permission', 'You must be logged in to follow a post');

    var post = Posts.findOne(postId);
    if (!post)
    throw new Meteor.Error('invalid-post', 'The post you are trying to follow does not exist');

    //checks if owner
    if (post.userId == userId)
    throw new Meteor.Error('invalid-upvote', 'You cannot upvote your own post');

    var course = Courses.findOne(post.courseId);
    if (!course)
    throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

    //Checks if enrolled
    if(Meteor.users.findOne(userId).profile.courses.indexOf(course._id) == -1)
    throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course to follow the question');

    if(post.upvoters){

      if (post.upvoters.indexOf(userId) != -1) { // If the user has already upvoted
        var options = {
          $inc: {upvotesCount: -1},
          $pull : {
            "upvoters": userId
          }}
          // if user is an instructor
          if (course.instructors.indexOf(Meteor.user().username) != -1) {
            options = _.extend(options, {
              $set: {'badges.isInstructorUpvoted': false}
            });
          }
        } else {
          var options = {
            $inc: {upvotesCount: +1},
            $addToSet : {
              "upvoters": userId
            }
          };
          // if user is an instructor
          if (course.instructors.indexOf(Meteor.user().username) != -1) {
            options = _.extend(options, {
              $set: {'badges.isInstructorUpvoted': true}
            });
          }
        }
        //updates post
        Posts.update({_id: postId},options);
      }
    },
    followQuestion: function(postId){
      check(postId, String);

      var userId = Meteor.userId();
      if (!userId)
      throw new Meteor.Error('invalid-permission', 'You must be logged in to follow a post');

      var post = Posts.findOne(postId);
      if (!post)
      throw new Meteor.Error('invalid-post', 'The post you are trying to follow does not exist');

      //checks if owner
      if (post.userId == userId)
      throw new Meteor.Error('invalid-unfollow', 'You cannot unfollow your own post');

      var course = Courses.findOne(post.courseId);
      if (!course)
      throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

      //Checks if enrolled
      if(Meteor.users.findOne(userId).profile.courses.indexOf(course._id) == -1)
      throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course to follow the question');

      var followers = post.followers;

      if(followers.indexOf(userId) != -1){ // If the user is already a follower
        Posts.update({_id: postId}, {$pull : {
          "followers": userId
        }});
      }else{
        Posts.update({_id: postId}, {$addToSet : {
          "followers": userId
        }});
      }
    },
    postDelete: function(postId){
      check(postId, String);

      var userId = Meteor.userId();
      if (!userId) {
        throw new Meteor.Error('invalid-permission', 'You must be logged in to delete a post');
      }

      var post = Posts.findOne(postId);
      if (!post)
      throw new Meteor.Error('invalid-post', 'The post you are trying to delete does not exist');

      var hasPermission;
      if(post.isAnonymous) {
        hasPermission = post.userIdenticon == Package.sha.SHA256(post._id + userId)
      } else {
        hasPermission = post.userId == userId;
      }

      if(hasPermission){
        Posts.update({_id: postId}, {$set : {
          "isDeleted": true
        }});

        Notifications.remove({postId: post._id, postCourseId: post.courseId});
      } else {
        throw new Meteor.Error('invalid-delete-permission', 'You don\'t have permission to delete this post!');
      }
    },
    viewPost: function(postId){
      check(postId, String);

      var userId = Meteor.userId();
      if (!userId)
      throw new Meteor.Error('invalid-permission', 'You must be logged in to view a post');

      var post = Posts.findOne({_id: postId});
      if(post){
        if(post.viewers.indexOf(userId) == -1){
          Posts.update({_id: postId},{
            $addToSet : {
              "viewers": userId
            },
            $inc: {
              "viewCount": 1
            }
          });
        }
      } else {
        throw new Meteor.Error('invalid-post', 'The post you are trying to view does not exist');
      }
    },
    liveAnswer: function(postId) {
      check(postId, String);

      if (Meteor.isServer) {
        var userId = Meteor.userId();

        if (!userId) {
          throw new Meteor.Error('invalid-permission', 'You must be logged in to write an answer');
        }

        var post = Posts.findOne(postId);
        if (!post)
        throw new Meteor.Error('invalid-answer', 'You must answer on a post');

        var course = Courses.findOne(post.courseId);
        if (!course)
        throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

        //Checks if enrolled
        if(Meteor.users.findOne(userId).profile.courses.indexOf(course._id) == -1)
        throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course');

        LiveAnswers.update({postId: postId}, {
          $push: {
            usersLiveAnswering: userId
          }
        }, { upsert: true }
      );

      Meteor.setTimeout(function(){
        LiveAnswers.update({postId: postId},{
          $pop: {
            usersLiveAnswering: userId
          }
        })
      }, 60000);

      return true;
    }
  }
});


EasySearch.createSearchIndex('defaultSearch', {
  'collection': Posts, // instanceof Meteor.Collection
  'field': ['title','text'], // array of fields to be searchable
  'limit': 15,
  'use' : 'mongo-db',
  'sort': function() {
    return { 'upvotesCount': -1, 'date_created': -1 };
  },
  'query': function(searchString, opts) {

    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);
    query.isDeleted = false;

    return query;
  }
});

EasySearch.createSearchIndex('courseSearch', {
  'collection': Posts, // instanceof Meteor.Collection
  'field': ['title','text'], // array of fields to be searchable
  'limit': 15,
  'use' : 'minimongo',
  'sort': function() {
    return { 'upvotesCount': -1, 'createdAt': -1 };
  },
  'query': function(searchString, opts) {

    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    if (this.props.courseId) {
      query.courseId = this.props.courseId;
    }

    return query;
  }
});

purifyHTML = function(text){
  return sanitizeHtml(text, {
    allowedTags: [ 'strong', 'em', 'span', 'a', 'p', 'ul', 'ol', 'li', 'img', 'code', 'pre' ],
    allowedAttributes: {
      'a': [ 'title', 'href', 'target'],
      'span': ['style'],
      'p': ['style'],
      'img': ['src', 'alt', 'width', 'height'],
      'code': ['contenteditable', 'class'],
      'pre': ['contenteditable']
    }
  });
}
