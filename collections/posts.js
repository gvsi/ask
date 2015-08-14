Posts = new Mongo.Collection('posts', {
    transform: function(doc) {
        if (doc.isAnonymous) {
            delete doc.userId;
        }
        return doc;
    }
});

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
          userId: user._id,
          type: type,
          createdAt: now,
          updatedAt: now,
          answersCount: 0,
          upvotesCount: 0,
          upvoters: [],
          isDeleted: false,
          followers: [user._id],
          viewers: [user._id]
        });

        var un = user.username.toLowerCase();
        if(course.instructors.indexOf(un) != -1){
          post = _.extend(postAttributes, {
            badges: { isInstructorPost: true },
            isInstructorPost: true
          });
        }

        var postId = Posts.insert(post);

        if(course.instructors.indexOf(un) != -1){
          var courseStudents = Meteor.users.find({"profile.courses": postAttributes.courseId});

          courseStudents.forEach(function(courseUser) {
            if(courseUser._id != user._id){
              var notificationAttributes = {
                intend: 'An instructor posted a note: ',
                postTitle: postAttributes.title,
                text: postAttributes.text,
                type: 'info',
                userId: courseUser._id,
                link: '/room/'+ postAttributes.courseId + '?p=' + postId,
                seen: false
              }

              Meteor.call("addNotification", notificationAttributes);
            }
          });
        }

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

        return {
          _id: postAttributes.postId
        };

    },
    upvote: function(postId){
      var userId = Meteor.user()._id;
      var post = Posts.findOne(postId);
      var voters = post.upvoters;

      if(userId != post.userId){
        if(voters.indexOf(userId) != -1){ // If the user has already upvoted
            Posts.update({_id: postId}, {
            $inc: {upvotesCount: -1},
            $pull : {
              "upvoters": userId
            }});
        }else{
            Posts.update({_id: postId}, {
              $inc: {upvotesCount: +1},
              $addToSet : {
              "upvoters": userId
            }});
        }
      }

    },
    followQuestion: function(postId){
      var userId = Meteor.user()._id;
      var followers = Posts.findOne(postId).followers;

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
      } else {
        throw new Meteor.Error('invalid-delete-permission', 'You don\'t have permission to delete this post!');
      }
    },
    viewPost: function(postId){
        var userId = Meteor.user()._id;
        Posts.update({_id: postId}, {$addToSet : {
          "viewers": userId
        }});
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
