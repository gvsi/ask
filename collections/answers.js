Answers = new Mongo.Collection('answers');

Meteor.methods({
  answerInsert: function(answerAttributes) {
    answerAttributes.body = UniHTML.purify(answerAttributes.body);

    check(answerAttributes, {
      postId: String,
      body: String
    });

    var user = Meteor.user();
    var post = Posts.findOne(answerAttributes.postId);

    if (!post)
      throw new Meteor.Error('invalid-answer', 'You must answer on a post');

    answer = _.extend(answerAttributes, {
      userId: user._id,
      //author: user.username,
      upvoters: [],
      downvoters: [],
      created_at: new Date(),
      updated_at: new Date(),
      comments: [],
      isAnonymous: false //TODO
    });

    // create the answer, save the id
    answer._id = Answers.insert(answer);

    // TODO: now create a notification, informing the user that there's been a answer

    return answer._id;
  },
  commentInsert: function(commentAttributes) {
    commentAttributes.body = UniHTML.purify(commentAttributes.body);

    check(commentAttributes, {
      answerId: String,
      body: String
    });

    var user = Meteor.user();
    var answer = Answers.findOne(commentAttributes.answerId);

    if (!answer)
      throw new Meteor.Error('invalid-comment', 'You must comment on an answer');

    comment = _.extend(commentAttributes, {
      userId: user._id,
      //author: user.username,
      created_at: new Date(),
      updated_at: new Date(),
      isAnonymous: false //TODO
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


      var upVoters = answer.upvoters;
      var downVoters = answer.downvoters;

      if(upVoters.indexOf(userId) != -1){ //It was already upvoted by the user
          if(voteAttributes.isUpvote){
            Answers.update({_id: voteAttributes.answerId}, {$pull : {
              "upvoters": userId
            }});
          }else{
            Answers.update({_id: voteAttributes.answerId}, {$pull : {
              "upvoters": userId
            }});
            Answers.update({_id: voteAttributes.answerId}, {$addToSet : {
              "downvoters": userId
            }});
          }
      }else if (downVoters.indexOf(userId) != -1) { //It was already downvoted by the user
          if(voteAttributes.isUpvote){
            Answers.update({_id: voteAttributes.answerId}, {$pull : {
              "downvoters": userId
            }});
            Answers.update({_id: voteAttributes.answerId}, {$addToSet : {
              "upvoters": userId
            }});
          }else{
            Answers.update({_id: voteAttributes.answerId}, {$pull : {
              "downvoters": userId
            }});
          }
      }else{
          if(voteAttributes.isUpvote){
            Answers.update({_id: voteAttributes.answerId}, {$addToSet : {
              "upvoters": userId
            }});
          }else{
            Answers.update({_id: voteAttributes.answerId}, {$addToSet : {
              "downvoters": userId
            }});
          }
      }

      var newAnswer = Answers.findOne(voteAttributes.answerId);
      return newAnswer.upvoters.length - newAnswer.downvoters.length;
  }
});
