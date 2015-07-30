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

    var notification = _.extend(notificationAttributes, {
      seen: 0
    });

    Notifications.insert(notification);
  },
  seeNotification:function(notificationId){
    check(notificationId, String);

    Notifications.update({_id: notificationId}, {$set:{
        seen: 1
    }});

  }
});
