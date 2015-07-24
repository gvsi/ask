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
      created_at: new Date(),
      updated_at: new Date(),
      isAnonymous: false //TODO
    });
    
    // create the answer, save the id
    answer._id = Answers.insert(answer);
    
    // TODO: now create a notification, informing the user that there's been a answer
    
    return answer._id;
  }
});