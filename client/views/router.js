
Router.route('/', function () {
  //ADD YOU ROUTES HERE
  //eg : this.render('home');
  this.render('blankPage');
},{
 layoutTemplate:"dashboardLayout" 
});

Router.route('/social', function () {
  this.render('socialApp');
},{
 layoutTemplate:"socialLayout" 
});

Router.route('/email', function () {
  this.render('emailList');
},{
 layoutTemplate:"emailLayout" 
});

Router.route('/email/compose', function () {
  this.render('emailCompose');
},{
 layoutTemplate:"emailLayout" 
});

Router.route('/calendar', function () {
  this.render('calendarApp');
},{
 layoutTemplate:"calendarLayout" 
});

//UI ELEMENTS
//1. COLOR PAGE
Router.route('/ui/color', function () {
  this.render('uiColor');
},{
 layoutTemplate:"defaultLayout" 
});

//2. TYPO PAGE
Router.route('/ui/typo', function () {
  this.render('uiTypo');
},{
 layoutTemplate:"defaultLayout" 
});

//3. Icons PAGE
Router.route('/ui/icons', function () {
  this.render('uiIcons');
},{
 layoutTemplate:"defaultLayout" 
});

//4. Buttons PAGE
Router.route('/ui/buttons', function () {
  this.render('uiButtons');
},{
 layoutTemplate:"defaultLayout" 
});

//5. Notifications PAGE
Router.route('/ui/notifications', function () {
  this.render('uiNotifications');
},{
 layoutTemplate:"defaultLayout" 
});

//6. Modals PAGE
Router.route('/ui/modals', function () {
  this.render('uiModals');
},{
 layoutTemplate:"defaultLayout" 
});

//7. Progress PAGE
Router.route('/ui/progress', function () {
  this.render('uiProgress');
},{
 layoutTemplate:"defaultLayout" 
});

//8. Progress PAGE
Router.route('/ui/tabs_accordian', function () {
  this.render('uiTabs');
},{
 layoutTemplate:"defaultLayout" 
});

//9. Progress PAGE
Router.route('/ui/sliders', function () {
  this.render('uiSliders');
},{
 layoutTemplate:"defaultLayout" 
});

//10. Tree-view PAGE
Router.route('/ui/tree-view', function () {
  this.render('uiTreeView');
},{
 layoutTemplate:"defaultLayout" 
});

//11. Tree-view PAGE
Router.route('/ui/nestables', function () {
  this.render('uiNestables');
},{
 layoutTemplate:"defaultLayout" 
});

Router.route('/forms/elements', function () {
  this.render('formElments');
},{
 layoutTemplate:"defaultLayout" 
});

Router.route('/forms/layouts', function () {
  this.render('formLayouts');
},{
 layoutTemplate:"defaultLayout" 
});

Router.route('/forms/wizard', function () {
  this.render('formWizard');
},{
 layoutTemplate:"defaultLayout" 
});