Template.page404.helpers({
  ready: function(){
    if (Session.get('is404Ready')) {
      return true;
    }
    setTimeout(function () {
      Session.set('is404Ready', true)
    }, 500);
  }
});
