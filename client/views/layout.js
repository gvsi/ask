Template.defaultLayout.rendered = function (){
	//INIT PAGES : API CALLS
	$('[data-pages="sidebar"]').sidebar();

	//Pages Progress Bar API
	$('[data-pages-progress="circle"]').each(function() {
        var $progress = $(this)
        $progress.circularProgress($progress.data())
    })
}

Template.postLayout.helpers({
	courseId: function(){
		return Router.current().params.course_id;
	}
});
