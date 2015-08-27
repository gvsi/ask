Posts = new Mongo.Collection('posts');

Meteor.methods({
    postInsert: function(postAttributes) {
          check(postAttributes, {
          title: String,
          text: String,
          tags: Array,
          courseId: String,
          isAnonymous: Boolean
        });

        var user = Meteor.user();
        var type = 1;
        var now = new Date();

        //if(user is instructor) -- 3
        //else if(poll) -- 2
        //else -- 1

        var course = Courses.findOne(postAttributes.courseId);
        if (!course)
          throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

        var post = _.extend(postAttributes, {
          userId: Meteor.userId(),
          type: type,
          createdAt: now,
          updatedAt: now,
          answersCount: 0,
          upvotesCount: 0,
          upvoters: [],
          isDeleted: false,
          followers: [user._id],
          viewers: [user._id],
          viewCount: 1
        });

        var un = user.username.toLowerCase();
        if(course.instructors.indexOf(un) != -1){
          post = _.extend(postAttributes, {
            badges: { isInstructorPost: true },
            isInstructorPost: true
          });
        }

        var postId = Posts.insert(post);

        //delete any answer drafts
        Drafts.remove({courseId: postAttributes.courseId, userId: user._id, type: "post"});

        var courseStudents = Meteor.users.find({"profile.courses": postAttributes.courseId});

        courseStudents.forEach(function(courseUser) {
            if(courseUser._id != user._id){
              if(course.instructors.indexOf(un) != -1){
                var postBodyWithoutTags = UniHTML.purify(postAttributes.text, {withoutTags: ['b', 'img', 'i', 'u', 'br', 'pre', 'p', 'span', 'div', 'a', 'li', 'ul', 'ol', 'h1-h7']});

                var notificationAttributes = {
                  intend: 'New instructor\'s note: ',
                  postTitle: postAttributes.title,
                  text: postBodyWithoutTags,
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
                var tempUrl = 'http://localhost:3000/room/' + course._id +'?p=' + postId;
                var courseUrl = 'http://localhost:3000/room/' + course._id;
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

        var user = Meteor.user();

        if (!user) {
          throw new Meteor.Error('invalid-user', 'You must be logged in to update a post');
          //TODO: CHECK USER PERMISSION TO DO THIS
        }
        var type = 1;

        //if(user is instructor) -- 3
        //else if(poll) -- 2
        //else -- 1

        //check existance of post to update
        if (Posts.find({_id: postAttributes.postId}, {_id: 1}).count() > 0) {
          // set identiconHash

          var identiconHash = postAttributes.isAnonymous ? postAttributes.postId + user._id : user._id;
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
        }

        var answerNotifications = Notifications.find({"postId": postAttributes.postId, "type": 'answerToPost'});
        answerNotifications.forEach(function(notification) {
            Notifications.update({_id: notification._id}, {$set:{
              postTitle: postAttributes.title,
            }});
          });

        var course = Courses.findOne(postAttributes.courseId);
        if (!course)
          throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

        if(course.instructors.indexOf(user.username.toLowerCase()) != -1){
          var noteNotifications = Notifications.find({"postId": postAttributes.postId, "type": 'instructorNote'});
          var postBodyWithoutTags = UniHTML.purify(postAttributes.text, {withoutTags: ['b', 'img', 'i', 'u', 'br', 'pre', 'p', 'span', 'div', 'a', 'li', 'ul', 'ol', 'h1-h7']});

          noteNotifications.forEach(function(notification) {
              Notifications.update({_id: notification._id}, {$set:{
                postTitle: postAttributes.title,
                text: postBodyWithoutTags,
              }});
            }
          );
        }

        return {
          _id: postAttributes.postId
        };

    },
    savePostDraft: function(postAttributes) {
      var userId = Meteor.userId();
      postDraft = Drafts.findOne({courseId: postAttributes.courseId, userId: userId, type: "post"});
      if (postDraft) {
        Drafts.update({courseId: postAttributes.courseId, userId: userId, type: "post"}, {$set: {body: postAttributes.body, title: postAttributes.title}});
      } else {
        Drafts.insert({courseId: postAttributes.courseId, userId: userId, type: "post", title: postAttributes.title, body: postAttributes.body});
      }
      return true;
    },
    upvote: function(postId){
      var userId = Meteor.user()._id;
      var post = Posts.findOne(postId);

      if(post.upvoters){

          if (userId != post.userId) {
            if (post.upvoters.indexOf(userId) != -1) { // If the user has already upvoted
                Posts.update({_id: postId}, {
                $inc: {upvotesCount: -1},
                $pull : {
                  "upvoters": userId
                }});
            } else {
                Posts.update({_id: postId}, {
                  $inc: {upvotesCount: +1},
                  $addToSet : {
                  "upvoters": userId
                }});
            }
          }
      }
    },
    followQuestion: function(postId){
      var userId = Meteor.user()._id;
      var followers = Posts.findOne(postId).followers;

      if(followers){
        if(followers.indexOf(userId) != -1){ // If the user is already a follower
            Posts.update({_id: postId}, {$pull : {
              "followers": userId
            }});
        }else{
            Posts.update({_id: postId}, {$addToSet : {
              "followers": userId
            }});
        }
      }
    },
    currentUserIsOwner: function(postId) {
      var post = Posts.findOne(postId);
      if (post) {
        var userId = Meteor.user()._id
        if(post.isAnonymous) {
          return post.userIdenticon == Package.sha.SHA256(post._id + userId)
        } else {
          return post.userId == userId;
        }
      } else {
        return false;
      }
    },
    postDelete: function(postId){
      var userId = Meteor.user()._id;
      var post = Posts.findOne(postId);
      var hasPermission;
      if (post)
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
        var userId = Meteor.user()._id;
        var post = Posts.findOne({_id: postId});
        if(post.viewers){
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
        }
    },
    liveAnswer: function(postId) {
    	if (Meteor.isServer) {
        var userId = Meteor.userId();
        Posts.update({_id: postId}, {
          $push: {
            usersLiveAnswering: userId
          }
        });

        Meteor.setTimeout(function(){
      		 Posts.update({_id: postId},{
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
