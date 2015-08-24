Template.settings.rendered = function(){
  	Session.set("DocumentTitle","Settings | Ask");
    console.log(Meteor.user().profile.emailPreferences);
    $('#'+Meteor.user().profile.emailPreferences).prop('checked',true);
}

Template.settings.events({
    'submit #settingsSubmit' : function(e, t){
      e.preventDefault();

    },
  });
