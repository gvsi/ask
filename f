[1mdiff --git a/client/views/post/post.js b/client/views/post/post.js[m
[1mindex c4a0178..c942bda 100644[m
[1m--- a/client/views/post/post.js[m
[1m+++ b/client/views/post/post.js[m
[36m@@ -1127,7 +1127,6 @@[m [mstrip_tags = function(input, allowed) {[m
 }[m
 [m
 loadTinyMCE = function(selector, height) {[m
[31m-  //console.log('loadTinyMCE: ' + selector);[m
   try {[m
     tinyMCE.remove()[m
   } catch(e) {}[m
[1mdiff --git a/client/views/settings/settings.js b/client/views/settings/settings.js[m
[1mindex eae46e5..04c89d7 100644[m
[1m--- a/client/views/settings/settings.js[m
[1m+++ b/client/views/settings/settings.js[m
[36m@@ -1,6 +1,5 @@[m
 Template.settings.rendered = function(){[m
   	Session.set("DocumentTitle","Settings | Ask");[m
[31m-    console.log(Meteor.user().profile.emailPreferences);[m
     $('#'+Meteor.user().profile.emailPreferences).prop('checked',true);[m
 }[m
 [m
[1mdiff --git a/collections/posts.js b/collections/posts.js[m
[1mindex 4c5d03c..dc875be 100644[m
[1m--- a/collections/posts.js[m
[1m+++ b/collections/posts.js[m
[36m@@ -97,7 +97,7 @@[m [mMeteor.methods({[m
         	//temp[m
         	emailAttributes.recipient = courseUser.profile.email;[m
 [m
[31m-          if(Meteor.isServer){[m
[32m+[m[32m          if(Meteor.isServer && emailAttributes.recipient){[m
           	Email.send({[m
           		from: "no-reply@ask.sli.is.ed.ac.uk",[m
           		to: emailAttributes.recipient,[m
[1mdiff --git a/server/easeLogin.js b/server/easeLogin.js[m
[1mindex ef58f7a..3408b1d 100644[m
[1m--- a/server/easeLogin.js[m
[1m+++ b/server/easeLogin.js[m
[36m@@ -15,8 +15,6 @@[m [mAccounts.registerLoginHandler(function(loginRequest) {[m
     throw new Meteor.Error('invalid-user', 'No user found with this uun');[m
   }[m
 [m
[31m-console.log(userId);[m
[31m-[m
   //creating the token and adding to the user[m
   var stampedToken = Accounts._generateStampedLoginToken();[m
   //hashing is something added with Meteor 0.7.x,[m
[1mdiff --git a/server/publications.js b/server/publications.js[m
[1mindex 88db527..5dd33a8 100644[m
[1m--- a/server/publications.js[m
[1m+++ b/server/publications.js[m
[36m@@ -313,7 +313,6 @@[m [mfor (var i = 0; i < 10; i++) {[m
 [m
 var instructors = Courses.findOne({'_id':courseId}).instructors;[m
 var users = Meteor.users.find({'username': {$in: instructors}, 'status.online':true},{fields: {'username': 1, 'profile.name': 1, 'profile.surname': 1,'profile.image':1, 'status.online': 1}});[m
[31m-//console.log(users);[m
 return users;[m
 [m
 })[m
[1mdiff --git a/server/run.js b/server/run.js[m
[1mindex 4b2dda1..f051cd9 100644[m
[1m--- a/server/run.js[m
[1m+++ b/server/run.js[m
[36m@@ -13,22 +13,34 @@[m [mMeteor.methods({[m
 		for (i in students) {[m
 			if(!Meteor.users.find({username: students[i].STU_CODE.toLowerCase()}).count()){[m
 				Accounts.createUser({username: students[i].STU_CODE.toLowerCase(), password: "temp"});[m
[31m-			}[m
 [m
[31m-			Meteor.users.update({username : students[i].STU_CODE.toLowerCase()}, {[m
[31m-				$set : {[m
[31m-					profile : {[m
[31m-						name : toTitleCase(students[i].STU_FUSD),[m
[31m-						surname: toTitleCase(students[i].STU_SURN),[m
[31m-						emailPreferences: '',[m
[31m-						email: students[i].STU_CODE.toLowerCase() + '@sms.ed.ac.uk'[m
[32m+[m				[32mMeteor.users.update({username : students[i].STU_CODE.toLowerCase()}, {[m
[32m+[m						[32m$set : {[m
[32m+[m							[32mprofile : {[m
[32m+[m								[32mname : toTitleCase(students[i].STU_FUSD),[m
[32m+[m								[32msurname: toTitleCase(students[i].STU_SURN),[m
[32m+[m								[32memailPreferences: '',[m
[32m+[m								[32memail: students[i].STU_CODE.toLowerCase() + '@sms.ed.ac.uk'[m
[32m+[m							[32m}[m
[32m+[m						[32m},[m
[32m+[m						[32m$unset : {[m
[32m+[m							[32m'services.password': true[m
[32m+[m						[32m}[m
[32m+[m					[32m}[m
[32m+[m				[32m);[m
[32m+[m			[32m}else{[m
[32m+[m				[32mMeteor.users.update({username : students[i].STU_CODE.toLowerCase()}, {[m
[32m+[m					[32m$set : {[m
[32m+[m						[32mprofile : {[m
[32m+[m							[32mname : toTitleCase(students[i].STU_FUSD),[m
[32m+[m							[32msurname: toTitleCase(students[i].STU_SURN),[m
[32m+[m						[32m}[m
 					}[m
[31m-				},[m
[31m-				$unset : {[m
[31m-					'services.password': true[m
 				}[m
[32m+[m			[32m);[m
 			}[m
[31m-		);[m
[32m+[m
[32m+[m
 	}[m
 [m
 	var coursesCsv = CoursesCsv.find().fetch();[m
