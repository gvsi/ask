Meteor.methods({
	setDatabase: function(pass) {
		//check if authorized to update the database
		if (Package.sha.SHA256(Package.sha.SHA256(pass)) != "2a74c5d6e30e8ddd993af09cf9a52ffa88710eb5948de612ea78fb8302cd0af0") {
			return "Unauthorised!";
		}

		function toTitleCase(str) {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		}

		var students = Students.find().fetch();

		for (i in students) {
			//if the student does not have an account yet
			if(!Meteor.users.find({username: students[i].STU_CODE.toLowerCase()}).count()){
				//create the account
				Accounts.createUser({username: students[i].STU_CODE.toLowerCase(), password: "temp"});

				//set initial data for the student
				Meteor.users.update({username : students[i].STU_CODE.toLowerCase()}, {
						$set : {
							profile : {
								name : toTitleCase(students[i].STU_FUSD),
								surname: toTitleCase(students[i].STU_SURN),
								emailPreferences: 'realTime',
								email: students[i].STU_CODE.toLowerCase() + '@sms.ed.ac.uk'
							}
						},
						$unset : {
							'services.password': true
						}
					}
				);
			}else{
				//update the name and surname if needed
				Meteor.users.update({username : students[i].STU_CODE.toLowerCase()}, {
					$set : {
						profile : {
							name : toTitleCase(students[i].STU_FUSD),
							surname: toTitleCase(students[i].STU_SURN),
						}
					}
				}
			);
			}


	}

	var coursesCsv = CoursesCsv.find().fetch();
	for (i in coursesCsv){
		//if the course exists
		if(Courses.find({courseCode: coursesCsv[i].MOD_CODE, year: coursesCsv[i].AYR_CODE, semester: coursesCsv[i].PSL_CODE}).count()){
			//update the course parameters
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
		//create a new course in the database
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

		//if the course orginizer does not have an account
		if(!Meteor.users.find({username: coursesCsv[i].MUA_EXTU.toLowerCase()}).count()){
			//create course orginizer account
			Accounts.createUser({username: coursesCsv[i].MUA_EXTU.toLowerCase(), password: ""});

			//set inital account settings
			Meteor.users.update({username : coursesCsv[i].MUA_EXTU.toLowerCase()}, {
				$addToSet : {
					"profile.courses": courseId,
				},
				$set: {
					"profile.emailPreferences": 'realTime',
					"profile.email": '',
				},
				$unset: {
					'services.password': true
				}
			});
		}else{
			//enroll the course orginizer in the course
			Meteor.users.update({username : coursesCsv[i].MUA_EXTU.toLowerCase()}, {
				$addToSet : {
					"profile.courses": courseId,
				}
			});
		}


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

	}

}

return "Database setup correctly";
},
setEmailPreferences: function(type){
	var currentUser =  Meteor.userId();
	SyncedCron.remove('email-'+currentUser);

	var emailFrequency,hours;
	if(type=='onceADay'){
		emailFrequency = 'at 5:00 pm';
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
					var currentCourse = Courses.findOne({_id: courseId});
					var tempUrl,courseUrl = LIVE_URL + 'room/' + currentCourse._id;

					tempBody += '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="33" style="border-collapse:collapse;padding:0">&nbsp;</td></tr></table><table width="600" cellpadding="0" cellspacing="0" class="invert" bgcolor="#353535" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> <tr style="padding:0"> <td height="40" width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> <td valign="middle" align="left" style="border-collapse:collapse;padding:0"> <!-- CONTENT start --> <div class="h" style="color:#FAFAFA;background-color:#353535;line-height:1;margin:0;height:20px"><div style="color:#FAFAFA;background-color:#353535;line-height:1;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:0px;margin-bottom:6px;margin-top:10px;margin:0;height:20px">New questions in <a href="'+courseUrl+'" style="text-decoration:none;color:inherit;">"'+ currentCourse.name +'"</a></div></div> <!-- CONTENT end --> </td> <td width="10" style="border-collapse:collapse;padding:0">&nbsp;</td> </tr> <tr style="padding:0"><td height="10" colspan="3" style="border-collapse:collapse;padding:0"></td></tr> </table>';

					var posts = Posts.find({"courseId": courseId}, {limit: 5, sort: {createdAt : -1}});
					posts.forEach(function(post){
						if(moment(new Date()).diff(moment(post.createdAt), 'hours') < hours){
							tempUrl = LIVE_URL + 'room/' + currentCourse._id +'?p=' + post._id;
							tempBody += '<table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="30" align="right" valign="top" class="small" style="border-collapse:collapse;padding:0"><div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px"></div></td></tr></table> <!-- 1/3 Image on the Left start --><table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td valign="top" style="border-collapse:collapse;padding:0"> <table width="600" cellpadding="0" cellspacing="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td width="20" style="border-collapse:collapse;padding:0">&nbsp;</td> <td width="393" valign="top" align="left" style="border-collapse:collapse;padding:0"> <div class="h" style="color:#787878;line-height:20px"><div style="color:#444444;line-height:24px;font-family:Helvetica,Arial,sans-serif;font-size:24px;font-weight:bold;letter-spacing:-2px;margin-bottom:6px;margin-top:10px"><a href="'+tempUrl +'" style="color: inherit;text-decoration:none;letter-spacing:-1px;">'+ post.title +'<span style="margin-left: 10px;letter-spacing: -1px;font-weight:300;font-size:70%; color: #888"> '+ moment(post.createdAt).format('MMMM Do YYYY, H:mm:ss') +' </span></a></div></div> <div style="color:#787878;line-height:20px">'+post.text+'</div> </td> <!-- CONTENT end --> </tr></table> </td> </tr></table> <!-- 1/3 Image on the Left end -->';
							tempCount+=1;
						}
					});

					if(tempCount){
						emailBody+=tempBody;
						postsCount +=1
					}
				});

				if(postsCount){
					var emailAttributes = {"emailBody": emailBody, "recipient": currentUser.profile.email, subject: "Ask digest" };

					var unsubscribeUrl = LIVE_URL + 'settings/unsubscribe';
        	var fullEmail = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd"> <html xmlns="http://www.w3.org/1999/xhtml"> <head> <meta http-equiv="Content-Type" content="text/html; charset=utf-8"> <meta name="viewport" content="width=device-width"> <title>Ask newsletter</title> <!-- Shared on MafiaShare.net --><!-- Shared on MafiaShare.net --></head> <body style="width:100% !important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;margin:0;padding:0;background-color:#FAFAFA"> <table class="bodytbl" width="100%" cellspacing="0" cellpadding="0" style="margin:0;padding:0;width:100% !important;border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;background-color:#FAFAFA;color:#787878;-webkit-text-size-adjust:none;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td align="center" style="border-collapse:collapse;padding:0"> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr height="20" style="padding:0"> <td align="left" valign="bottom" style="border-collapse:collapse;padding:0"> <div class="preheader" style="color:#787878;line-height:0px;font-size:0px;height:0px;display:none !important;visibility:hidden;text-indent:-9999px"><!-- PREHEADER --></div> <div class="small" style="color:#787878;line-height:20px"> </div> </td> </tr></table> <table width="600" cellspacing="0" cellpadding="0" class="line" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;border-bottom:1px solid #AAAAAA;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"></tr></table> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="13" align="right" style="border-collapse:collapse;padding:0"><table cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"></tr></table></td></tr></table> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr height="80" style="padding:0"> <td align="left" valign="bottom" style="border-collapse:collapse;padding:0; text-align:center;"> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"> <img src="http://drive.google.com/uc?export=view&id=0BwFPOKemAxp2XzZjQWJCMVM1WHc"  width="250px"> </table> </td> </tr></table>';
        	fullEmail += emailAttributes.emailBody;
        	fullEmail += '<!-- Footer start --><table width="600" cellspacing="0" cellpadding="0" class="line" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;border-bottom:1px solid #AAAAAA;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"><td height="39" style="border-collapse:collapse;padding:0">&nbsp;</td></tr></table> <table width="600" cellspacing="0" cellpadding="0" style="border-collapse:collapse;mso-table-lspace:0pt;mso-table-rspace:0pt;color:#787878;font-family:Helvetica,Arial,sans-serif;font-size:12px"><tr style="padding:0"> <td class="small" align="left" valign="top" style="border-collapse:collapse;padding:0"> <div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px">If you no longer wish to receive emails please <a href="'+ unsubscribeUrl +'" style="color:#00A9E0;text-decoration:none;padding:2px 0px">unsubscribe</a> </div> <div style="color:#787878;line-height:15px;font-size:10px;text-transform:uppercase;word-spacing:-1px;margin-bottom:4px;margin-top:6px">&copy; 2015 The University of Edinburgh, All rights reserved</div> </td> <td width="20" style="border-collapse:collapse;padding:0">&nbsp;</td> </tr></table> <!-- Footer end --> </td> </tr></table> </body> </html>';

        	//temp
        	emailAttributes.recipient = currentUser.profile.email;

        	Email.send({
        		from: "no-reply@ask.sli.is.ed.ac.uk",
        		to: emailAttributes.recipient,
        		subject: emailAttributes.subject,
        		html: fullEmail,
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
