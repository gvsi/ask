Feedbacks = new Mongo.Collection('feedbacks');

Meteor.methods({
  addFeedback:function(feedbackAttributes){
    check(feedbackAttributes, {
      subject: String,
      text: String,
      attachment: String
    });



    var feedback = _.extend(feedbackAttributes, {
      createdAt: new Date(),
      userId: Meteor.userId()
    });

    Feedbacks.insert(feedback);
  },

});
