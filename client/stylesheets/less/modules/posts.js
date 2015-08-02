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

        var post = _.extend(postAttributes, {
          owner: user._id,
          type: type,
          created_at: now,
          updated_at: now,
          upvoters: [],
          followers: [user._id],
        });

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
      var voters = Posts.findOne(post_id).upvoters;

      if(voters.indexOf(userId) != -1){ // If the user has already upvoted
          Posts.update({_id: post_id}, {$pull : {
            "upvoters": userId
          }});
      }else{
          Posts.update({_id: post_id}, {$addToSet : {
            "upvoters": userId
          }});
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

    }
})
