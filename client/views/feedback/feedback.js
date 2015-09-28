Template.feedbackForm.rendered = function (){
   $('#form-personal').validate();
   Session.set("DocumentTitle","Feedback | Ask");
}

Template.feedbackForm.events({
  'click #submitFeedback': function (e) {
    e.preventDefault();

    var feedbackAttributes = {
       subject: $("#subject").val(),
       text: $("#feedback").val()
    }

    Meteor.call("addFeedback", feedbackAttributes, function(error, result){
      if(error){
        console.log("error", error);
      }
    });

    Router.go('home');
  }
});
