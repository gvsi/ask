Feedbacks = new Mongo.Collection('feedbacks');

Meteor.methods({
  addFeedback:function(feedbackAttributes){
    if (Meteor.user()) {
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
          from: "no-reply@ask.sli.is.ed.ac.uk",
          to: ["s1432492@sms.ed.ac.uk", "s1448512@sms.ed.ac.uk"],
          subject: "Ask Feedback",
          html: 'From: '+ Meteor.user().profile.name +' '+ Meteor.user().profile.surname +' <br> Subject: '+ feedbackAttributes.subject +' <br> Body: '+ feedbackAttributes.text + attachment
        });
      }
    } else {
      throw new Meteor.Error('invalid-user', 'You must be logged in to submit feedback');
    }
  },

});
