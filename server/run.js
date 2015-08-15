Meteor.methods({
	runCode: function() {
		var user = Meteor.user().username;
		if (user == "s1448512" || user == "s1432492") {
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

			var coursesCsv = CoursesCsv.find().fetch();
			for (i in coursesCsv){

				if(Courses.find({courseCode: coursesCsv[i].MOD_CODE, year: coursesCsv[i].AYR_CODE, semester: coursesCsv[i].PSL_CODE}).count()){
					Courses.update(
						{courseCode: coursesCsv[i].MOD_CODE, year: coursesCsv[i].AYR_CODE, semester: coursesCsv[i].PSL_CODE},
						{$set: {
							"courseCode": coursesCsv[i].MOD_CODE,
							"name": coursesCsv[i].MOD_NAME,
							"year": coursesCsv[i].AYR_CODE,
							"semester": coursesCsv[i].PSL_CODE,
						},
						$addToSet: {"instructors": coursesCsv[i].MUA_EXTU.toLowerCase() }
					}
				);
			}else{
				Courses.insert(
					{
						"courseCode": coursesCsv[i].MOD_CODE,
						"name": coursesCsv[i].MOD_NAME,
						"year": coursesCsv[i].AYR_CODE,
						"semester": coursesCsv[i].PSL_CODE,
						"areTagsDefault": 1,
						"tags": ['wk1', 'wk2', 'wk3', 'wk4', 'wk5','wk6', 'wk7','wk8','wk9','wk10','wk11','logistics','exam','other' ],
						"instructors": [coursesCsv[i].MUA_EXTU.toLowerCase()]
					}
				);
			}
		}

		var enrolments = Enrolments.find().fetch();
		for (i in enrolments) {
			// find if there's a student with that UUN
			if (Meteor.users.findOne({username: enrolments[i].STU_CODE.toLowerCase()})) {

				// find if there's a course from the enrolment
				var course = Courses.findOne({courseCode: enrolments[i].MOD_CODE, year: enrolments[i].AYR_CODE, semester: enrolments[i].PSL_CODE});
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
	} else {
		throw new Meteor.Error('invalid-permission', 'You don\'t have permission to run this');
	}
}
});


/*Meteor.call('runCode', function (err, response) {
console.log(response);
});*/
