Students = new Mongo.Collection('students');
Visits = new Mongo.Collection('visits');

Meteor.methods({
  /**
   * @summary Removes the user's profile picture
   * @isMethod true
   * @memberOf Users
   * @locus Server
   */
  deleteProfilePicture: function() {
    var userId = Meteor.userId();
    if (userId) {
      Meteor.users.update({_id: userId}, {$unset: {"profile.image": 1 } });
    } else {
      throw new Meteor.Error('invalid-permission', 'You should be logged in to do this');
    }
  },

  /**
   * @summary Logs the user's visit to a course
   * @isMethod true
   * @memberOf Users
   * @locus Server
   */
  visitCourse: function(courseId) {
    var userId = Meteor.userId();
    var currentDate = moment().startOf('day').toDate();
    var visit = Visits.findOne({userId: userId, date: currentDate, course: courseId});

    if(!visit){
      var visitAttributes = {
        userId: userId,
        date: currentDate,
        course: courseId
      };

      Visits.insert(visitAttributes);
    }
  }
});
