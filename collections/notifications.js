Notifications = new Mongo.Collection('notifications');

Meteor.methods({
  /**
   * @summary Adds a new notification to the database
   * @isMethod true
   * @memberOf Notifications
   * @locus Server
   * @param {Object} [notificationAttributes]
   * @param {String} notificationAttributes.intend The title of the notification
   * @param {String} notificationAttributes.postTitle The title of the post related to the notification
   * @param {String} notificationAttributes.text The text of the post of the notification
   * @param {String} notificationAttributes.type The type of notification (answer, new post, new note, etc.)
   * @param {String} notificationAttributes.answerId The id of the answer related to the notification
   * @param {String} notificationAttributes.postId The id of the post related to the notification
   * @param {String} notificationAttributes.postCourseId The id of the course related to the notification
   * @param {String} notificationAttributes.userId The id of the user generating the notification
   * @param {Boolean} notificationAttributes.seen Flags whether the notification has been seen or not.
   */
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

  /**
   * @summary Marks a notification as seen
   * @isMethod true
   * @memberOf Notifications
   * @locus Server
   * @param {String} notificationId The id of the seen notification
   */
  seeNotification: function(notificationId){
    check(notificationId, String);

    Notifications.update({_id: notificationId}, {$set:{
      seen: true
    }});
  }
});
