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

        //if(user is instructor) -- 3
        //else if(poll) -- 2
        //else -- 1

        var post = _.extend(postAttributes, {
          owner: user._id,
          type: type,
          created_at: new Date(),
          updated_at: new Date(),
          upvoters: [],
        });

        var postId = Posts.insert(post);

        // set identiconHash
        var identiconHash = postAttributes.isAnonymous ? postId + postAttributes.owner : postAttributes.owner;
        Posts.update({_id: postId}, {$set: {ownerIdenticon: Package.sha.SHA256(identiconHash)}})

        return {
          _id: postId
        };
    },
    upvote: function(post_id){
      var userId = Meteor.user()._id;
      var voters = Posts.findOne(post_id).upvoters;

      if(voters.indexOf(userId) != -1){
          Posts.update({_id: post_id}, {$pull : {
            "upvoters": userId
          }});
      }else{
          Posts.update({_id: post_id}, {$addToSet : {
            "upvoters": userId
          }});
      }

    }
})
