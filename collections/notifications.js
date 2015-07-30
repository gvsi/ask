Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  addNotification:function(notificationAttributes){
    check(notificationAttributes, {
      title: String,
      text: String,
      type: String,
      userId: String,
      link: String
    });


    Notifications.insert(notificationAttributes);
  }
});
