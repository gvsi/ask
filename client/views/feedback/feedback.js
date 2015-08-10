Template.feedbackForm.created = function() {
  Uploader.init(this);
}

Template.feedbackForm.rendered = function (){
   Uploader.render.call(this);
   $('#form-personal').validate();
}

Template.feedbackForm.events({
  'click #submitFeedback': function (e) {
    var instance = Template.instance();
    var attachment = "";
    if(instance.info.get()){
      Uploader.startUpload.call(Template.instance(), e);
      attachment = Template.instance().info.get().name;
    }

    var feedbackAttributes = {
       subject: $("#subject").val(),
       text: $("#feedback").val(),
       attachment: attachment
    }

    Meteor.call("addFeedback", feedbackAttributes, function(error, result){
      if(error){
        console.log("error", error);
      }else{
          Router.go('home');
      }
      if(result){

      }
    });

  }
});

Template.feedbackForm.helpers({
  'infoLabel': function() {
    var instance = Template.instance();

    // we may have not yet selected a file
    var info = instance.info.get()
    if (!info) {
      return;
    }

    var progress = instance.globalInfo.get();

    // we display different result when running or not
    return progress.running ?
      info.name + ' - ' + progress.progress + '% - [' + progress.bitrate + ']' :
      info.name + ' - ' + info.size + 'B';
  },
  'progress': function() {
    return Template.instance().globalInfo.get().progress + '%';
  }
});
