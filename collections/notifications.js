Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  addNotification:function(notificationAttributes){
    check(notificationAttributes, {
      intend: String,
      postTitle: String,
      text: String,
      type: String,
      userId: String,
      link: String,
      seen: Boolean
    });


    Notifications.insert(notificationAttributes);
  },
  seeNotification: function(notificationId){
    check(notificationId, String);

    Notifications.update({_id: notificationId}, {$set:{
          seen: true
    }});
  }
});
