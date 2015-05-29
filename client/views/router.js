
Router.route('/', function () {
  //ADD YOU ROUTES HERE
  //eg : this.render('home');
  this.render('blankPage');
},{
 layoutTemplate:"defaultLayout" 
});

Router.route('/social', function () {
  this.render('socialApp');
},{
 layoutTemplate:"socialLayout" 
});

Router.route('/calendar', function () {
  this.render('calendarApp');
},{
 layoutTemplate:"calendarLayout" 
});