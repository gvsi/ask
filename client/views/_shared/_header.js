Template.header.helpers({
	identiconHash: function() {
		return Package.sha.SHA256(Meteor.user()._id);
	}
});

Template.header.rendered = function() {
	$('.notification-list .dropdown-menu').on('click', function(event) {
            event.stopPropagation();
  });
	$('.toggle-more-details').on('click', function(event) {
			var p = $(this).closest('.heading');
			p.closest('.heading').children('.more-details').stop().slideToggle('fast', function() {
					p.toggleClass('open');
			});
	});
}
