Template.courseStats.rendered = function(){
  $(".widget-3 .metro").liveTile();

  builtArea();
  // (function() {
  //   var container = '#widget-15-chart';
  //
  //   var data = [];
  //   var dates = [];
  //   for (var i = 0; i < 10; i++) {
  // 		var date = moment().subtract(9, 'days').add(i, 'days');
  //     dates.push(date.format("MMM Do YY"));
  // 		data.push({x:i+1, y:Counts.get("visitsOn-"+date.format("L"))+Math.floor((Math.random() * 14) + 1)});
  // 	}
  //
  //   var graph = new Rickshaw.Graph({
  //     renderer: 'area',
  //     element: document.querySelector(container),
  //     height: 150,
  //     padding: {
  //       top: 0.1
  //     },
  //     series: [{
  //       data: data,
  //       color: $.Pages.getColor('complete-light'),
  //       name: "Visits"
  //     }]
  //
  //   });
  //
  //   var hoverDetail = new Rickshaw.Graph.HoverDetail({
  //     graph: graph,
  //     formatter: function(series, x, y) {
  //       var date = '<span class="date">' + dates[x-1] + '</span>';
  //       var swatch = '<span class="detail_swatch" style="background-color: ' + series.color + '"></span>';
  //       var content = swatch + series.name + ": " + parseInt(y) + '<br>' + date;
  //       return content;
  //     }
  //   });
  //
  //   graph.render();
  //
  //   $(window).resize(function() {
  //     graph.configure({
  //       width: $(container).width(),
  //       height: 150
  //     });
  //
  //     graph.render()
  //   });
  //
  //   $(container).data('chart', graph);
  //
  // })();

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
      return "<strong>1</strong> unanswered question &nbsp; &nbsp;<span data-filter='unanswered' class='changeFilterBtn label font-montserrat'><a href='#'>view</a></span>"
    } else if (count > 1) {
      return "<strong>"+count+"</strong> unanswered questions &nbsp; &nbsp;<span data-filter='unanswered' class='changeFilterBtn label font-montserrat'><a href='#'>view</a></span>"
    }
  },
  unreadPostsText: function() {
    var count = Counts.get('unreadPosts');
    if (count == 0) {
      return "You're all caught up! There are no unread posts"
    } else if (count == 1) {
      return "<strong>1</strong> unread post &nbsp; &nbsp;<span data-filter='unread' class='changeFilterBtn label font-montserrat'><a href='#'>view</a></span>"
    } else if (count > 1) {
      return "<strong>"+count+"</strong> unread posts &nbsp; &nbsp;<span data-filter='unread' class='changeFilterBtn label font-montserrat'><a href='#'>view</a></span>"
    }
  },
  lastPost: function() {
    var post = Posts.findOne({courseId: this._id}, {sort:{createdAt:-1}});
    return post;
  },
  latestPosts: function() {
    var posts = Posts.find({courseId: this._id}, {skip: 1, sort:{createdAt:-1}, limit: 3});
    return posts;
  }
});

Template.visitsGraph.helpers({
  visitsToday: function() {
    return Counts.get("visitsOn-"+moment().format("L"));
  }
});

Template.courseStats.events({
  "click .changeFilterBtn": function(e){
    var filter = $(e.currentTarget).attr('data-filter');
    Session.set('postFilter', filter);
  }
});

Template.latestPostSlide.events({
  "click .postTitle": function(event, template){
    var postId = this._id;
    $('.item').removeClass('active');
    $("li[data-post-id="+ postId +"]").addClass('active');
    $('.no-post').hide();
    $('.post-content-wrapper').show();
    Router.go('room', {courseId: this.courseId}, {query: 'p='+postId});
    loadPage(postId, false);
  }
});
Template.latestPostSlide.helpers({
  dateFromNow: function() {
    return moment(this.createdAt).fromNow();
  }
});

function builtArea() {

  var data = [];
  var dates = [];
  for (var i = 0; i < 10; i++) {
    var date = moment().subtract(9, 'days').add(i, 'days');
    dates.push(date.format("DD/MM"));
    data.push(Counts.get("visitsOn-"+date.format("L"))+Math.floor((Math.random() * 14) + 1));
  }

  console.log(data);
  console.log(dates);

  var chartsOptions = {
    chart: {
      type: 'area',
      height: 300
    },
    title: {
      text: 'Daily Visits',
      x: -20 //center
    },
    xAxis: {
      categories: dates
    },
    yAxis: {
      title: {
        text: 'Visits'
      },
      plotLines: [{
        value: 0,
        width: 1,
        color: '#808080'
      }]
    },
    plotOptions: {
      area: {
        fillColor: {
          linearGradient: {
            x1: 0,
            y1: 0,
            x2: 0,
            y2: 1
          },
          stops: [
            [0, Highcharts.getOptions().colors[0]],
            [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
          ]
        },
        marker: {
          radius: 2
        },
        lineWidth: 1,
        states: {
          hover: {
            lineWidth: 1
          }
        },
        threshold: null
      }
    },
    legend: {
      enabled: false
    },
    credits: {
      enabled: false
    },
    tooltip: {
      valueSuffix: ' users'
    },
    series: [{
      name: 'Views',
      data: data
    }]
  }

  $('#graph-lg').highcharts(chartsOptions);
  $('#graph-md').highcharts(chartsOptions);

}
