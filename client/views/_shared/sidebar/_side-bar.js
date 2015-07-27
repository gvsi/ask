Template.sideBar.rendered = function (){
	//Initialize Pages Side Bar
	$('[data-pages="sidebar"]').each(function() {
		 var $sidebar = $(this)
		 $sidebar.sidebar($sidebar.data())
	})
};

Template.sideBar.helpers({
	courses: function () {
		Meteor.subscribe('coursesForStudent', Meteor.userId());
		return Courses.find({});
	},
	courseInitials: function () {
		return this.MOD_CODE.substring(0,2);
	}
});
