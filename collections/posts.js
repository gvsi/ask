Posts = new Mongo.Collection('posts');

Meteor.methods({
    postInsert: function(postAttributes) {
          check(postAttributes, {
          title: String,
          text: String,
          tags: Array,
          course_id: String,
          isAnonymous: Boolean
        });

        var user = Meteor.user();
        var type = 1;
        var now = new Date();

        //if(user is instructor) -- 3
        //else if(poll) -- 2
        //else -- 1

        var course = Courses.findOne(postAttributes.course_id);
        if (!course)
          throw new Meteor.Error('invalid-course', 'This post does not belong to any course');

        var post = _.extend(postAttributes, {
          owner: user._id,
          type: type,
          created_at: now,
          updated_at: now,
          answersCount: 0,
          upvotesCount: 0,
          upvoters: [],
          followers: [user._id],
        });

        var un = user.username.toLowerCase();
        if(course.instructors.indexOf(un) != -1){
          post = _.extend(postAttributes, {
            isInstructorPost: true
          });
        }

        var postId = Posts.insert(post);

        // set identiconHash
        var identiconHash = postAttributes.isAnonymous ? postId + postAttributes.owner : postAttributes.owner;
        Posts.update({_id: postId}, {$set: {ownerIdenticon: Package.sha.SHA256(identiconHash)}})

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
          course_id: String,
          isAnonymous: Boolean
        });

        var user = Meteor.user();
        var type = 1;

        //if(user is instructor) -- 3
        //else if(poll) -- 2
        //else -- 1

        //TODO: CHECK USER PERMISSION TO DO THIS

        //check existance of post to update
        if (Posts.find({_id: postAttributes.postId}, {_id: 1}).count() > 0) {
          // set identiconHash
          var identiconHash = postAttributes.isAnonymous ? postAttributes.postId + Posts.findOne(postAttributes.postId).owner : Posts.findOne(postAttributes.postId).owner;
          var now = new Date();
          Posts.update(
            {_id: postAttributes.postId},
            {
              $set: {
                title: postAttributes.title,
                text: postAttributes.text,
                isAnonymous: postAttributes.isAnonymous,
                tags: postAttributes.tags,
                ownerIdenticon: Package.sha.SHA256(identiconHash),
                updated_at: now
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
    upvote: function(post_id){
      var userId = Meteor.user()._id;
      var post = Posts.findOne(post_id);
      var voters = post.upvoters;

      if(userId != post.owner){
        if(voters.indexOf(userId) != -1){ // If the user has already upvoted
            Posts.update({_id: post_id}, {
            $inc: {upvotesCount: -1},
            $pull : {
              "upvoters": userId
            }});
        }else{
            Posts.update({_id: post_id}, {
              $inc: {upvotesCount: +1},
              $addToSet : {
              "upvoters": userId
            }});
        }
      }

    },
    followQuestion: function(post_id){
      var userId = Meteor.user()._id;
      var followers = Posts.findOne(post_id).followers;

      if(followers.indexOf(userId) != -1){ // If the user is already a follower
          Posts.update({_id: post_id}, {$pull : {
            "followers": userId
          }});
      }else{
          Posts.update({_id: post_id}, {$addToSet : {
            "followers": userId
          }});
      }
    },
    currentUserIsOwner: function(post_id) {
      var post = Posts.findOne(post_id);
      if (post)
        return post.owner == Meteor.user()._id;
      else
        return false;
    },
    postDelete: function(post_id){
      var userId = Meteor.user()._id;
      var post = Posts.findOne(post_id);

      if(userId == post.owner){
        Posts.update({_id: post_id}, {$set : {
          "isDeleted": true
        }});
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
    console.log("searchString: " + searchString);

    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    return query;
  }
});

EasySearch.createSearchIndex('courseSearch', {
  'collection': Posts, // instanceof Meteor.Collection
  'field': ['title','text'], // array of fields to be searchable
  'limit': 15,
  'use' : 'minimongo',
  'sort': function() {
    return { 'upvotesCount': -1, 'created_at': -1 };
  },
  'query': function(searchString, opts) {
    console.log("searchString: " + searchString);

    var query = EasySearch.getSearcher(this.use).defaultQuery(this, searchString);

    if (this.props.course_id) {
      query.course_id = this.props.course_id;
    }

    return query;
  }
});
