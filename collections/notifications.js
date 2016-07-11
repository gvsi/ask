Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  addNotification:function(notificationAttributes){
    check(notificationAttributes, {
      intend: String,
      postTitle: String,
      text: String,
      type: String,
      answerId: String,
      postId: String,
      postCourseId: String,
      userId: String,
      seen: Boolean
    });

    var notification = _.extend(notificationAttributes, {
      createdAt: new Date(),
    });

    Notifications.insert(notification);
  },
  seeNotification: function(notificationId){
    check(notificationId, String);

    Notifications.update({_id: notificationId}, {$set:{
      seen: true
    }});
  }
});
