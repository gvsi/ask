Meteor.methods({
	runCode: function() {

			function toTitleCase(str) {
				return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			}

			var students = Students.find().fetch();

			for (i in students) {
				if(!Meteor.users.find({username: students[i].STU_CODE.toLowerCase()}).count()){
					Accounts.createUser({username: students[i].STU_CODE.toLowerCase(), password: students[i].STU_CODE.toLowerCase()});
					//create a job;
				}

				Meteor.users.update({username : students[i].STU_CODE.toLowerCase()}, {$set : {
					profile : {
						name : toTitleCase(students[i].STU_FUSD),
						surname: toTitleCase(students[i].STU_SURN),
						emailPreferences: ''
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

				var courseId = Courses.insert(
					{
						"courseCode": coursesCsv[i].MOD_CODE,
						"name": coursesCsv[i].MOD_NAME,
						"year": coursesCsv[i].AYR_CODE,
						"semester": coursesCsv[i].PSL_CODE,
						"areTagsDefault": true,
						"tags": ['wk1', 'wk2', 'wk3', 'wk4', 'wk5','wk6', 'wk7','wk8','wk9','wk10','wk11','logistics','exam','other' ],
						"instructors": [coursesCsv[i].MUA_EXTU.toLowerCase()]
					}
				);

				if(!Meteor.users.find({username: coursesCsv[i].MUA_EXTU.toLowerCase()}).count()){
					Accounts.createUser({username: coursesCsv[i].MUA_EXTU.toLowerCase(), password: coursesCsv[i].MUA_EXTU.toLowerCase()});
				}

				Meteor.users.update({username : coursesCsv[i].MUA_EXTU.toLowerCase()}, {
				$addToSet : {
					"profile.courses": courseId,
				},
				$set: {
					"profile.emailPreferences": '',
				}
				});
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
},
setEmailPreferences: function(type){
	var currentUser =  Meteor.userId();
	SyncedCron.remove(Meteor.userId());

	var emailFrequency;
	if(type=='onceADay'){
		emailFrequency = 'at 5:00 pm';
	}else if (type=='once4hours') {
		emailFrequency = 'every 4 hours';
	}

  if(type!='none' && type!='realTime'){
		SyncedCron.add({
			name: Meteor.userId(),
			schedule: function(parser) {
				// parser is a later.parse object
				return parser.text(emailFrequency);
			},
			job: function() {
				console.log("SEND MESSAGE TO " + currentUser);
			}
		});
	}

	Meteor.users.update({_id: Meteor.userId()}, {$set : {
		"profile.emailPreferences": type
	}});
}

});




/*Meteor.call('runCode', function (err, response) {
console.log(response);
});*/
