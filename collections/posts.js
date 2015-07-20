Posts = new Mongo.Collection('posts');

Meteor.methods({
    postInsert: function(postAttributes) {
        check(postAttributes, {
          title: String,
          text: String,
          tags: String,
          //course_id: String
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
        
        return {
          _id: postId
        };
    }
})