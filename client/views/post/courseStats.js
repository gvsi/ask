Template.courseStats.helpers({
  studentResponsesCount: function(){
    return Counts.get('contributionsCount') - Counts.get('instructorResponsesCount')
  }
});
