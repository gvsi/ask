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
	SyncedCron.remove('email-'+currentUser);

	var emailFrequency,hours;
	if(type=='onceADay'){
		emailFrequency = 'every 1 minutes'//'at 5:00 pm';
		hours = 24;
	}else if (type=='once4hours') {
		emailFrequency = 'every 4 hours';
		hours = 4;
	}

  if(type!='never' && type!='realTime'){
		SyncedCron.add({
			name: 'email-'+currentUser,
			schedule: function(parser) {
				// parser is a later.parse object
				return parser.text(emailFrequency);
			},
			job: function() {

				var emailBody = '';
				var postsCount = 0;
				var courses = Meteor.users.findOne({_id: currentUser}).profile.courses;
				courses.forEach(function(courseId) {
					var tempBody = '';
					var tempCount = 0;
					var tempUrl;
					var currentCourse = Courses.findOne({_id: courseId});
					tempBody += '<br><h1>>New questions in ' + currentCourse.name + '</h1>';

					var posts = Posts.find({"courseId": courseId}, {limit: 5, sort: {createdAt : -1}});
					posts.forEach(function(post){
						if(moment(new Date()).diff(moment(post.createdAt), 'hours') < hours){
							tempUrl = 'http://localhost:3000/room/' + currentCourse._id +'?p=' + post._id;
							tempBody += '<a href='+ tempUrl +'><h2>' + post.title + ' - ' + moment(post.createdAt).format('MMMM Do YYYY, H:mm:ss') + '</h2></a>' ;
							tempBody += '<p>' + post.text + '</p>';
							tempCount+=1;
						}
					});

					if(tempCount){
						emailBody+=tempBody;
						postsCount +=1
					}
				});

				if(postsCount){
					Email.send({
						from: "martingeorgiev1995@gmail.com",
						to: "martingeorgiev1995@gmail.com",
						subject: "Ask Digest",
						html: emailBody
					});
				}
			}
		});
	}

	Meteor.users.update({_id: currentUser}, {$set : {
		"profile.emailPreferences": type
	}});
}

});




/*Meteor.call('runCode', function (err, response) {
console.log(response);
});*/
