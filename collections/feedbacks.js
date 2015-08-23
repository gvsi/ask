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

    if (Meteor.isServer) {
      Email.send({
        from: "martingeorgiev1995@gmail.com",
        to: "martingeorgiev1995@gmail.com",
        subject: feedbackAttributes.subject,
        text: feedbackAttributes.text + '\n\nAttachemnt: ' + feedbackAttributes.attachment,
      });
    }
  },

});
