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

    var attachment = '';
    if(feedbackAttributes.attachment!=""){
       attachment = '<br> Attachment: <a href="localhost3000/'+ feedbackAttributes.attachment +'">Attachment</a>';
    }

    if (Meteor.isServer) {
      Email.send({
        from: "martingeorgiev1995@gmail.com",
        to: "martingeorgiev1995@gmail.com",
        subject: "Ask Feedback",
        html: 'From: '+ Meteor.user().profile.name +' '+ Meteor.user().profile.surname +' <br> Subject: '+ feedbackAttributes.subject +' <br> Body: '+ feedbackAttributes.text + attachment
      });
    }
  },

});
