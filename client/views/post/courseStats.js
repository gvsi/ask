Template.courseStats.rendered = function(){
  $(".widget-3 .metro").liveTile();

  (function() {
      var container = '.widget-15-chart';

      var seriesData = [
          [],
          []
      ];
      var random = new Rickshaw.Fixtures.RandomData(20);
      for (var i = 0; i < 20; i++) {
          random.addData(seriesData);
      }
      var graph = new Rickshaw.Graph({
          renderer: 'bar',
          element: document.querySelector(container),
          height: 100,
          padding: {
              top: 0.5
          },
          series: [{
              data: [{"x":1,"y":10},{"x":2,"y":8},{"x":3,"y":12},{"x":4,"y":1},{"x":5,"y":15}],
              color: $.Pages.getColor('complete-light'),
              name: "New users"
          }]

      });

      var hoverDetail = new Rickshaw.Graph.HoverDetail({
          graph: graph,
          formatter: function(series, x, y) {
              var date = '<span class="date">' + new Date(x * 1000).toUTCString() + '</span>';
              var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
              var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
              return content;
          }
      });

      graph.render();

      $(window).resize(function() {
          graph.configure({
              width: $(container).width(),
              height: 200
          });

          graph.render()
      });

      $(container).data('chart', graph);

  })();

}

Template.courseStats.helpers({
  studentResponsesCount: function(){
    return Counts.get('answers') - Counts.get('instructorResponses')
  },
  averageResponseTime: function(){
    // average = total response time / (# questions - # unansweredQuestions)
    return Math.round(Counts.get('totalResponseTime') / (Counts.get('totalQuestions') - Counts.get('unansweredQuestions')));
  },
  course: function() {
    var course = Courses.findOne({_id: Router.current().params.courseId});
    return course;
  },
  studentsOnlineText: function() {
    var count = Counts.get('onlineUsers') - Counts.get('onlineInstructors');
    if (count <= 0) {
      return "0 students"
    } else if (count == 1) {
      return "<strong>1</strong> student"
    } else if (count > 1) {
      return "<strong>" + count + "</strong> students"
    }
  },
  instructorsOnlineText: function() {
    var count = Counts.get('onlineInstructors');
    if (count == 1) {
      var str = "<strong>1</strong> instructor:"
      str = addInstructor(str, this.instructors);
      return str;
    } else if (count > 1) {
      var str = "<strong>" + count + "</strong> instructors:"
      str = addInstructor(str, this.instructors);
      return str;
    } else {
      return "0 instructors"
    }

    function addInstructor(str, instructorsArray) {
      str += "<ul class='fs-14'>"
      var instructors = Meteor.users.find({username: {$in : instructorsArray}, 'status.online': true}).fetch();
      instructors.forEach(function(instructor) {
        str+= "<li>" + instructor.profile.name + " " + instructor.profile.surname + "</li>";
      })
      str += "</ul>"
      return str;
    }
  },
  unansweredQuestionsText: function() {
    var count = Counts.get('unansweredQuestions');
    if (count == 0) {
      return "Sweet! There are no answered questions"
    } else if (count == 1) {
      return "<strong>1</strong> answered question &nbsp; &nbsp;<span class='label font-montserrat'><a href='#'>view</a></span>"
    } else if (count > 1) {
      return "<strong>"+count+"</strong> answered questions &nbsp; &nbsp;<span class='label font-montserrat'><a href='#'>view</a></span>"
    }
  },
  unreadPostsText: function() {
    var count = Counts.get('unreadPosts');
    if (count == 0) {
      return "You're all caught up! There are no unread posts"
    } else if (count == 1) {
      return "<strong>1</strong> unread post &nbsp; &nbsp;<span class='label font-montserrat'><a href='#'>view</a></span>"
    } else if (count > 1) {
      return "<strong>"+count+"</strong> unread posts &nbsp; &nbsp;<span class='label font-montserrat'><a href='#'>view</a></span>"
    }
  },
  lastPost: function() {
    var post = Posts.findOne({courseId: this._id}, {sort:{createdAt:-1}});
    return post;
  },
  latestPosts: function() {
    var posts = Posts.find({courseId: this._id}, {limit: 3});
    return posts;
  }
});

Template.latestPostSlide.helpers({
  dateFromNow: function() {
    return moment(this.createdAt).fromNow();
  },
  postLink: function() {
    return "/room/" + this.courseId + "?p=" + this._id;
  }
});
