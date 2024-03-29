Posts = new Mongo.Collection('posts');
Drafts = new Mongo.Collection('drafts');
LiveAnswers = new Mongo.Collection('liveAnswers');

Meteor.methods({
  /**
   * @summary Inserts a new post in the database and creates appropriate notifications.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param {Object} [postAttributes]
   * @param {String} postAttributes.title The title of the post
   * @param {String} postAttributes.text The text of the post
   * @param {Array} postAttributes.tags The tags of the post
   * @param {Boolean} postAttributes.isAnonymous Flags whether the post is anonymous or not
   * @param {String} postAttributes.courseId The id of the course to which the post belongs
   */
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
      report: "",
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
            intend: Meteor.users.findOne(userId).profile.name + ' posted a new note: ',
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
          var tempUrl = LIVE_URL + 'room/' + course._id +'?p=' + postId;
          var courseUrl = LIVE_URL + 'room/' + course._id;
          var title = course.instructors.indexOf(un) != -1 ? "New Instructor Note" : "New question";
          var emailBody = '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="33" style="border-collapse:collapse;padding:0">&nbsp;</td></tr></table><table width="600" cellpadding="0" cellspacing="0" class="invert" bgcolor="#353535" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> <tr style="padding:0"> <td height="40" width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> <td valign="middle" align="left" style="border-collapse:collapse;padding:0"> <!-- CONTENT start --> <div class="h" style="color:#FAFAFA;background-color:#353535;line-height:1;margin:0;height:20px"><div style="color:#FAFAFA;background-color:#353535;line-height:1;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:0px;margin-bottom:6px;margin-top:10px;margin:0;height:20px">'+title+'</td> <td width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> </tr> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> </table>';
          emailBody += '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="30" align="right" valign="top" class="small" style="border-collapse:collapse;padding:0"><div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px"></div></td></tr></table> <!-- 1/3 Image on the Left start --><table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td valign="top" style="border-collapse:collapse;padding:0"> <table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td width="20" style="border-collapse:collapse;padding:0">&nbsp;</td> <td width="393" valign="top" align="left" style="border-collapse:collapse;padding:0"> <div class="h" style="color:#787878;line-height:20px"><div style="color:#444444;line-height:24px;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:-2px;margin-bottom:6px;margin-top:10px"><a href="'+tempUrl +'" style="color: inherit;text-decoration:none;letter-spacing:-1px;">'+ postAttributes.title +'<span style="margin-left: 10px;letter-spacing: -1px;font-weight:300;font-size:70%; color: #888"> at '+ moment(now).format('H:mm') +' </span></a></div></div> <div style="color:#787878;line-height:20px"></div> <div><a href="'+ tempUrl +'" style="color: #0072C6;text-decoration:none">open</a></div></td> <!-- CONTENT end --> </tr></table> </td> </tr></table> <!-- 1/3 Image on the Left end -->';
          var emailAttributes = {"emailBody": emailBody, "recipient":  courseUser.profile.email, "subject": postAttributes.title  };

          var unsubscribeUrl = LIVE_URL + 'settings/unsubscribe';
          var fullEmail = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <title>Ask newsletter</title> <!-- Shared on MafiaShare.net --><!-- Shared on MafiaShare.net --></head> <body style="width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0;padding:0;background-color:#FAFAFA"> <table class="bodytbl" width="100%" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100% !important;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#FAFAFA;color:#787878;-webkit-text-size-adjust:none;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td align="center" style="border-collapse:collapse;padding:0"> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr height="20" style="padding:0"> <td align="left" valign="bottom" style="border-collapse:collapse;padding:0"> <div class="preheader" style="color:#787878;line-height:0px;font-size:0px;height:0px;display:none !important;visibility:hidden;text-indent:-9999px"><!-- PREHEADER --></div> <div class="small" style="color:#787878;line-height:20px"> </div> </td> </tr></table> <table width="600" cellspacing="0" cellpadding="0" class="line" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;border-bottom:1px solid #AAAAAA;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"></tr></table> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="13" align="right" style="border-collapse:collapse;padding:0"><table cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"></tr></table></td></tr></table> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr height="80" style="padding:0"> <td align="left" valign="bottom" style="border-collapse:collapse;padding:0; text-align:center;"> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"> <img src="http://drive.google.com/uc?export=view&id=0BwFPOKemAxp2XzZjQWJCMVM1WHc"  width="250px"> </table> </td> </tr></table>';
          fullEmail += emailAttributes.emailBody;
          fullEmail += '<!-- Footer start --><table width="600" cellspacing="0" cellpadding="0" class="line" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;border-bottom:1px solid #AAAAAA;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="39" style="border-collapse:collapse;padding:0">&nbsp;</td></tr></table> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td class="small" align="left" valign="top" style="border-collapse:collapse;padding:0"> <div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px">If you no longer wish to receive emails please <a href="'+ unsubscribeUrl +'" style="color:#00A9E0;text-decoration:none;padding:2px 0px">unsubscribe</a> </div> <div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px">Please do not reply directly to this email</div> <div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px">&copy; 2015 The University of Edinburgh, All rights reserved</div> </td> <td width="20" style="border-collapse:collapse;padding:0">&nbsp;</td> </tr></table> <!-- Footer end --> </td> </tr></table> </body> </html>';

          //temp
          emailAttributes.recipient = courseUser.profile.email;

          if(Meteor.isServer && emailAttributes.recipient){
            Email.send({
              from:  "Ask <ask@ask.sli.is.ed.ac.uk>",
              to: emailAttributes.recipient,
              subject: emailAttributes.subject,
              html: fullEmail,
            });
          }
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

  /**
   * @summary Updates a post in the database and updates all related notifications.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param  {Object} postAttributes The attributes of the post to update.
   */
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

  /**
   * @summary Saves a draft of a post in the database.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param  {Object} postAttributes The attributes of the draft of the post.
   */
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

  /**
   * @summary Upvotes a post in the database.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param  {String} postId The id of the post to update.
   */
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
      throw new Meteor.Error('invalid-permission', 'You need to be enrolled in the course to upvote the question');

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

  /**
   * @summary Follows a question for the user, so that they can receive notifications.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param  {String} postId The id of the post to follow.
   */
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

  /**
   * @summary Deletes a post from the database.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param  {String} postId The id of the post to delete.
   */
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

  /**
   * @summary Sets a post as viewed by the user.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param  {String} postId The id of the post that has been viewed.
   */
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

  /**
   * @summary Flags a post as having a answer that is being typed. This is done by creating temporary records on the Liveanswers table that are removed after 60 seconds.
   * @isMethod true
   * @memberOf Posts
   * @locus Server
   * @param  {String} postId The id of the post with live answers.
   */
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

/**
 * @summary Sanitizes text before database insertion by removing malicious and not permitted tags.
 * @static
 * @param {String} text Text to sanitize
 */

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
