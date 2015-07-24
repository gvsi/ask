Meteor.methods({
	runCode: function() {

		var dirty = 'some <img src="saf.sfd"><b>really tacky</b> HTML';
    	var clean = sanitizeHtml(dirty, {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat([ 'img' ])
});

		return clean;
	}
})


/*Meteor.call('runCode', function (err, response) {
  console.log(response);
});*/