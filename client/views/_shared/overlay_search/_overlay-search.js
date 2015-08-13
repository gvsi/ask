Template.overlaySearch.rendered = function (){
  $('[data-pages="search"]').search({
    searchField: '#overlay-search',
    closeButton: '.overlay-close',
    brand: '.brand'
  });
};

Template.overlaySearch.helpers({
  searchType: function(){
    if (Router.current().params.courseId) {
      var s = Session.get('searchType');
      if (s) {
        return s;
      } else {
        return 'courseSearch';
      }
    } else {
      return 'defaultSearch';
    }
  },
  courseName: function(){
    var courseId = Router.current().params.courseId;
    if (courseId) {
      var course = Courses.findOne(courseId);
      if (course) {
        return course.name;
      }
    }
  }
});

Template.overlaySearch.events({
  "click #defaultSearchCkbx": function(event){
    var q = $('#overlay-search').val()
    if ($(event.currentTarget).is(':checked')) {
      Session.set('searchType', 'defaultSearch');
    } else {
      Session.set('searchType', 'courseSearch');
    }
    setTimeout(function() {
      $('#overlay-search').val(q);
      $('#overlay-search').focus();
      $('#overlay-search').keyup();
    }, 100);
  },
  "click .card-header": function() {
    var postId = this._id;
    var courseId = this.courseId;
    //console.log(this._id);
    $(".overlay").fadeOut("fast").addClass("closed");

    setTimeout(function () {
      Session.set("postId", postId);
      loadPage(postId);
      Router.go('room', {courseId: courseId}, {query: 'p='+postId});
    }, 300);
  },
  "keyup #overlay-search": _.throttle(function(e) {
    var val = $('#overlay-search').val().trim();
    if (val != "") {
      Session.set('searchString', val);
      //console.log($('#overlay-search').val());
    } else {
      Session.set('searchString', undefined);
    }
  }, 200)
});

Template.resultCard.helpers({
  userName: function() {
    if (!this.isAnonymous) {
      Meteor.subscribe('singleUser', this.userId);
      var o = Meteor.users.findOne(this.userId);
      if (o) {
        return o.profile.name + " " + o.profile.surname;
      }
    } else {
      return "Anonymous";
    }
  },
  dateFromNow: function() {
    return moment(this.createdAt).fromNow();
  },
  formattedTitle: function() {
    var string = this.title;
    var queryString = $("#overlay-search").val();
    var rgxp = new RegExp("("+ queryString +")", "ig");
    var res = string.replace(rgxp, '<b>$1</b>');
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

    var res = results.join("<br>");

    if (res) {
      return res;
    } else {
      var rgxwords = new RegExp('([^ ]*[ ]{0,1}){1,20}', 'g');      // regexp for specified number of spaces
      var text = this.text.replace(/\s\s+/g, ' ');        // replace multiple whitespaces whit single space
      var txt = text.match(rgxwords)[0];         // get the substring with "nrw" number of words
      if (txt.length != this.text.length)
        txt += "…";
      return txt;
    }
  },
  courseName: function() {
    var courseId = this.courseId;
    if (courseId) {
      var course = Courses.findOne(courseId);
      if (course) {
        return course.name;
      }
    }
  },
  isDefaultSearch: function() {
    return $("#defaultSearchCkbx").is(':checked');
  }
});
