Template.settings.rendered = function(){
  	Session.set("DocumentTitle","Settings | Ask");
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
  'click #deleteImage': function(){
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
  },
  currentUserHasAvatar: function(){
    var user = Meteor.user();
    if(user && user.profile.image){
      return true;
    }else{
      return false;
    }
  },
  currentUserAvatar: function(){
    var user = Meteor.user();
    if(user && user.profile.image){
      return user.profile.image;
    }else{
      return "";
    }
  }
});
