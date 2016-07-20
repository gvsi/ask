Courses = new Mongo.Collection('courses');
Enrolments = new Mongo.Collection('enrolments');

CoursesCsv = new Mongo.Collection('courses.csv');

Meteor.methods({
  /**
   * @summary Inserts or removes tag from a course.
   * @isMethod true
   * @memberOf Courses
   * @locus Server
   * @param  {Object} tagAttributes The attributes of the tag to inser.
   */
  addOrRemoveTag: function(tagAttributes){
    check(tagAttributes, {
      courseId: String,
      isAdd: Boolean,
      tag: String
    });

    var course = Courses.findOne({_id: tagAttributes.courseId});

    if (course) {
      if (Meteor.user() && course.instructors.indexOf(Meteor.user().username) != -1) {
        if(!Courses.findOne(tagAttributes.courseId).areTagsDefault){

          if(tagAttributes.isAdd){
            Courses.update({_id: tagAttributes.courseId}, {$addToSet: {
              "tags": tagAttributes.tag
            }});
          }else{
            Courses.update({_id: tagAttributes.courseId}, {$pull: {
              "tags": tagAttributes.tag
            }});
          }
        }
      } else {
        throw new Meteor.Error('invalid-permission', 'You should be logged in as an instructor too add or remove other instructors');
      }
    } else {
      throw new Meteor.Error('invalid-course', 'This course does not exist');
    }
  },
  /**
   * @summary Add or removes an instructor from the course.
   * @isMethod true
   * @memberOf Courses
   * @locus Server
   * @param  {Object} instructorAttributes The attributes of the instructor to add or remove.
   */
  addOrRemoveInstructor: function(instructorAttributes){
    check(instructorAttributes, {
      courseId: String,
      isAdd: Boolean,
      instructor: String
    });

    var course = Courses.findOne({_id: instructorAttributes.courseId});

    if (course) {
      if (Meteor.user() && course.instructors.indexOf(Meteor.user().username) != -1) {
        if(instructorAttributes.instructor.toLowerCase() != Meteor.user().username.toLowerCase()){
          if(instructorAttributes.isAdd){
            Courses.update({_id: instructorAttributes.courseId}, {$addToSet: {
              "instructors": instructorAttributes.instructor.toLowerCase()
            }});
          }else{
            Courses.update({_id: instructorAttributes.courseId}, {$pull: {
              "instructors": instructorAttributes.instructor.toLowerCase()
            }});
          }
        }
      } else {
        throw new Meteor.Error('invalid-permission', 'You should be logged in as an instructor too add or remove other instructors');
      }
    } else {
      throw new Meteor.Error('invalid-course', 'This course does not exist');
    }
  },
  /**
   * @summary Toggle the option to use the default tags for a particular course.
   * @isMethod true
   * @memberOf Courses
   * @locus Server
   * @param  {Object} tagAttributes The attributes of the new settings: course id and the toggle setting.
   */
  setOrRemoveDefaultTags: function(tagAttributes){
    check(tagAttributes, {
      courseId: String,
      areTagsDefault: Boolean
    });

    var course = Courses.findOne({_id: tagAttributes.courseId});

    if (course) {
      if (Meteor.user() && course.instructors.indexOf(Meteor.user().username) != -1) {
        Courses.update({_id: tagAttributes.courseId}, {$set: {
          "areTagsDefault": tagAttributes.areTagsDefault
        }});

        if(tagAttributes.areTagsDefault){
          Courses.update({_id: tagAttributes.courseId}, {$set: {
            "tags": ['wk1', 'wk2', 'wk3', 'wk4', 'wk5','wk6', 'wk7','wk8','wk9','wk10','wk11','logistics','exam','other' ]
          }});
        }else{
          Courses.update({_id: tagAttributes.courseId}, {$set: {
            "tags": []
          }});
        }
      } else {
        throw new Meteor.Error('invalid-permission', 'You should be logged in as an instructor for this course to set or remove tags');
      }
    } else {
      throw new Meteor.Error('invalid-course', 'This course does not exist');
    }
  },
  /**
   * @summary Set a course to be the last visited by the user, so that it can be loaded immediately for future access.
   * @isMethod true
   * @memberOf Courses
   * @locus Server
   * @param  {String} courseId The id of the courses that has been last visited.
   */
  setLastCourse: function(courseId){
    check(courseId, String);
    var userId = Meteor.userId();
    if (userId) {
      Meteor.users.update({_id: userId}, {$set:{
        "profile.lastCourse": courseId,
      }});
    } else {
      throw new Meteor.Error('invalid-permission', 'You should be logged in to set last course');
    }
  }
});
