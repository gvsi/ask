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
    return Counts.get('contributions') - Counts.get('instructorResponses')
  },
  averageResponseTime: function(){
    // average = total response time / (# questions - # unansweredQuestions)
    return Math.round(Counts.get('totalResponseTime') / (Counts.get('totalQuestions') - Counts.get('unansweredQuestions')));
  },
  course: function() {
    var course = Courses.findOne({_id: Router.current().params.courseId});
    console.log(course);

    return course;
  }
});
