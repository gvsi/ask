Template.overlaySearch.rendered = function (){
  $('[data-pages="search"]').search({
    searchField: '#overlay-search',
    closeButton: '.overlay-close',
    suggestions: '#overlay-suggestions',
    brand: '.brand',
    onSearchSubmit: function(searchString) {
      console.log("Search for: " + searchString);
    },
    onKeyEnter: function(searchString) {
      if (Router.current().params.course_id) {
        EasySearch.changeProperty('courseSearch', 'course_id', Router.current().params.course_id);
      }
      //console.log("Live search for: " + searchString);
    }
  });
};

Template.overlaySearch.helpers({
  searchType: function(){
    if (Router.current().params.course_id) {
      return 'courseSearch';
    } else {
      return 'defaultSearch';
    }
  }
});

Template.resultCard.helpers({
  ownerName: function() {
    if (!this.isAnonymous) {
      console.log('hi');
      Meteor.subscribe('singleUser', this.owner);
      var o = Meteor.users.findOne(this.owner);
      if (o) {
        return o.profile.name + " " + o.profile.surname;
      }
    } else {
      return "Anonymous";
    }
  },
  dateFromNow: function() {
    return moment(this.created_at).fromNow();
  }
});
