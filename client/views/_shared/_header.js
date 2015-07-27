Template.header.helpers({
	student: function () {
		if (Meteor.user()) {
			var uun = Meteor.user().username;
			Meteor.subscribe("singleStudent", uun.toUpperCase());

			//capitalises first char of each word in a string
			function toTitleCase(str) {
			    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
			}

			var s = Students.findOne({'STU_CODE': uun.toUpperCase()});

			if (s) {
				s.STU_FUSD = toTitleCase(s.STU_FUSD);
				s.STU_SURN = toTitleCase(s.STU_SURN);
				return s;
			}/* else {
				throw new Meteor.Error('no-currentUser', 'There is no user logged in');
			}*/
		}
	},
	identiconHash: function() {
		return Package.sha.SHA256(Meteor.user()._id);
	}

});
