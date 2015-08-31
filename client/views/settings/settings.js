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
  'click button.inc': function () {
    $('#editYourAvatarModal').modal();
  },
  'click #modalDeleteImage': function(){
    Meteor.call("deleteProfilePicture", function(error, result){
      if(error){
        console.log("error", error);
      }
    });
    $("#modalDeleteImage").modal('hide');
  }
});

Template.settings.helpers({
  identiconHash: function() {
    return Package.sha.SHA256(Meteor.user()._id);
  }
});
