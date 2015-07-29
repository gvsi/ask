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
      "tags": ['w1', 'w2', 'w3', 'w4', 'w5','w6', 'w7','w8','w9','w10','w11','logistics','project','exam','other' ]
    }});
  }else{
    Courses.update({_id: tagAttributes.courseId}, {$set: {
      "tags": []
    }});
  }
 }
});
