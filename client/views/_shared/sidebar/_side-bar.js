Template.sideBar.rendered = function (){
	//Initialize Pages Side Bar
	$('[data-pages="sidebar"]').each(function() {
		 var $sidebar = $(this)
		 $sidebar.sidebar($sidebar.data())
	})
};