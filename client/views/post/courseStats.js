Template.courseStats.rendered = function(){
  $(".widget-3 .metro").liveTile();

  (function() {
      var container = '.widget-15-chart2';

      var seriesData = [
          [],
          []
      ];
      var random = new Rickshaw.Fixtures.RandomData(40);
      for (var i = 0; i < 20; i++) {
          random.addData(seriesData);
      }

      var graph = new Rickshaw.Graph({
          renderer: 'bar',
          element: document.querySelector(container),
          padding: {
              top: 0.5
          },
          series: [{
              data: seriesData[0],
              color: $.Pages.getColor('complete-light'),
              name: "New users"
          }, {
              data: seriesData[1],
              color: $.Pages.getColor('master-lighter'),
              name: "Returning users"

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
              height: 100
          });

          graph.render()
      });

      $(container).data('chart', graph);

  })();

  d3.json('http://revox.io/json/min_sales_chart.json', function(data) {

      // Widget-15
      nv.addGraph(function() {
          var chart = nv.models.lineChart()
              .x(function(d) {
                  return d[0]
              })
              .y(function(d) {
                  return d[1]
              })
              .color(['#27cebc'])
              .useInteractiveGuideline(true)
              .margin({
                  top: 10,
                  right: -10,
                  bottom: 10,
                  left: -10
              })
              .showXAxis(false)
              .showYAxis(false)
              .showLegend(false)

          d3.select('.widget-16-chart svg')
              .datum(data.siteVisits)
              .call(chart);

          nv.utils.windowResize(chart.update);

          nv.utils.windowResize(function() {
              setTimeout(function() {
                  $('.widget-16-chart .nvd3 circle.nv-point').attr("r", "4");
              }, 500);
          });

          return chart;
      }, function() {
          setTimeout(function() {
              $('.widget-16-chart .nvd3 circle.nv-point').attr("r", "4");
          }, 500);
      });
  });
}

Template.courseStats.helpers({
  studentResponsesCount: function(){
    return Counts.get('contributions') - Counts.get('instructorResponses')
  },
  averageResponseTime: function(){
    // average = total response time / (# questions - # unansweredQuestions)
    return Math.round(Counts.get('totalResponseTime') / (Counts.get('totalQuestions') - Counts.get('unansweredQuestions')));
  }
});
