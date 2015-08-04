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
        
        console.log("course: " + Router.current().params.course_id);
      }
      console.log("Live search for: " + searchString);
      // var searchField = $('#overlay-search');
      // var searchResults = $('.search-results');
      // clearTimeout($.data(this, 'timer'));
      // searchResults.fadeOut("fast");
      // var wait = setTimeout(function() {
      //   searchResults.find('.result-name').each(function() {
      //     if (searchField.val().length != 0) {
      //       $(this).html(searchField.val());
      //       searchResults.fadeIn("fast");
      //     }
      //   });
      // }, 500);
      // $(this).data('timer', wait);
    }
  });
};
