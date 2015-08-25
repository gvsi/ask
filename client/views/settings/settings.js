Template.settings.rendered = function(){
  	Session.set("DocumentTitle","Settings | Ask");
    console.log(Meteor.user().profile.emailPreferences);
    $('#'+Meteor.user().profile.emailPreferences).prop('checked',true);
}

Template.settings.events({
    'change input[name="emailOption"]:radio' : function(e, t){
      Meteor.call("setEmailPreferences", $(e.currentTarget).val(), function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){

        }
      });
    },
  });
