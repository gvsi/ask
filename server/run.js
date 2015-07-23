Meteor.methods({
	runCode: function() {

		function toTitleCase(str) {
		    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}

		var students = Students.find().fetch();
		for (i in students) {
			Meteor.users.update({username : students[i].STU_CODE.toLowerCase()}, {$set : {
				profile : {
					name : toTitleCase(students[i].STU_FUSD), 
					surname: toTitleCase(students[i].STU_SURN)
				}
			}}); 
		}

		var enrolments = Enrolments.find().fetch();
		for (i in enrolments) {
			// find if there's a student with that UUN
			if (Meteor.users.findOne({username: enrolments[i].STU_CODE.toLowerCase()})) {
				
				// find if there's a course from the enrolment
				var course = Courses.findOne({MOD_CODE: enrolments[i].MOD_CODE, AYR_CODE: enrolments[i].AYR_CODE, PSL_CODE: enrolments[i].PSL_CODE});
				if (course) {
					Meteor.users.update({username : enrolments[i].STU_CODE.toLowerCase()}, {$addToSet : {
						"profile.courses": course._id
					}});
				}

			} else {
				//error
			}

		}

		return true;
	}
})


/*Meteor.call('runCode', function (err, response) {
  console.log(response);
});*/