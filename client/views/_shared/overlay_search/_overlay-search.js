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
      Meteor.subscribe('singleUser', this.owner);
      var o = Meteor.users.findOne(this.owner);
      console.log(this.owner);
      console.log(o);
      if (o) {
        return o.profile.name + " " + o.profile.surname;
      }
    } else {
      return "Anonymous";
    }
  },
  dateFromNow: function() {
    return moment(this.created_at).fromNow();
  },
  formattedTitle: function() {
    var string = this.title;
    var queryString = $("#overlay-search").val();
    var rgxp = new RegExp("("+ queryString +")", "ig");
    var res = string.replace(rgxp, '<b>$1</b>');
    console.log(res);
    return res;
  },
  formattedText: function() {
    var string = this.text;
    var queryString = $("#overlay-search").val(); // What we want highlighted

    var rgxp = new RegExp("(\\S*.{0,30})?("+ queryString +")(.{0,150}\\S*)?", "ig");
    // If you want to account for newlines, replace dots `.` with `[\\s\\S]`
    var results = [];

    string.replace(rgxp, function(match, $1, $2, $3){
      results.push( ($1?""+$1:"") +"<b>"+ $2 +"</b>"+ ($3?$3+"…":"") );
    });

    console.log( results.join("\n") );
    return results.join("<br>");
  }
});
