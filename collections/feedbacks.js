Feedbacks = new Mongo.Collection('feedbacks');

Meteor.methods({
  /**
   * @summary Processes a user feedback and emails it to the administrators.
   * @isMethod true
   * @memberOf Feedback
   * @locus Server
   * @param  {Object} [feedbackAttributes]
   * @param  {String} feedbackAttributes.subject The subject of the feedback
   * @param  {String} feedbackAttributes.text The content of the feedback
   */
  addFeedback:function(feedbackAttributes){
    if (Meteor.user()) {
      check(feedbackAttributes, {
        subject: String,
        text: String
      });

      var feedback = _.extend(feedbackAttributes, {
        createdAt: new Date(),
        userId: Meteor.userId()
      });

      Feedbacks.insert(feedback);

      var attachment = '';

      if (Meteor.isServer) {
        Email.send({
          from: "ask@ask.sli.is.ed.ac.uk",
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