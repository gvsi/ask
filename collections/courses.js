Courses = new Mongo.Collection('courses');

Enrolments = new Mongo.Collection('enrolments');

CoursesCsv = new Mongo.Collection('courses.csv');

Meteor.methods({
  addOrRemoveTag: function(tagAttributes){

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
 },
 setOrRemoveDefaultTags: function(tagAttributes){
   Courses.update({_id: tagAttributes.courseId}, {$set: {
    "areTagsDefault": tagAttributes.areTagsDefault
   }});

  if(tagAttributes.areTagsDefault){
    Courses.update({_id: tagAttributes.courseId}, {$set: {
      "tags": ['wk1', 'wk2', 'wk3', 'wk4', 'wk5','wk6', 'wk7','wk8','wk9','wk10','wk11','logistics','project','exam','other' ]
    }});
  }else{
    Courses.update({_id: tagAttributes.courseId}, {$set: {
      "tags": []
    }});
  }
 }
});
