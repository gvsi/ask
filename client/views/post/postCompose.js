Template.postCompose.rendered = function(){
  mathquill();
  var LatexImages = false;
  $(function(){
    function printTree(html)
    {
      html = html.match(/<[a-z]+|<\/[a-z]+>|./ig);
      if(!html) return '';
      var indent = '\n', tree = '';
      while(html.length)
      {
        var token = html.shift();
        if(token.charAt(0) === '<')
        {
          if(token.charAt(1) === '/')
          {
            indent = indent.slice(0,-2);
            if(html[0] && html[0].slice(0,2) === '</')
            token += indent.slice(0,-2);
          }
          else
          {
            tree += indent;
            indent += '  ';
          }
          token = token.toLowerCase();
        }

        tree += token;
      }
      return tree.slice(1);
    }
    var editingSource = false, latexSource = $('#latex-source'), htmlSource = $('#html-source'), codecogs = $('#codecogs'), latexMath = $('.mathquill-editor').bind('keydown keypress', function()
    {
      setTimeout(function() {
        htmlSource.text(printTree(latexMath.mathquill('html')));
        var latex = latexMath.mathquill('latex');
        if(!editingSource)
        latexSource.val(latex);
        if(!LatexImages)
        return;
        latex = encodeURIComponent(latexSource.val());
        //            location.hash = '#'+latex; //extremely performance-crippling in Chrome for some reason
        codecogs.attr('src','http://latex.codecogs.com/gif.latex?'+latex).parent().attr('href','http://latex.codecogs.com/gif.latex?'+latex);
      });
    }).keydown().focus();

  });

  $('#summernote-compose').summernote({
    height: 400,
    toolbar: [
      ['misc', ['undo','redo','fullscreen']],
      ['style', ['bold', 'italic', 'underline']],
      ['insert', ['picture', 'link']],
      ['fontsize', ['fontsize']],
      ['para', ['ul', 'ol', 'paragraph']]
    ],
    onfocus: function(e) {
      $('body').addClass('overlay-disabled');
    },
    onblur: function(e) {
      $('body').removeClass('overlay-disabled');
    },
    onpaste: function(e) {
      var bufferText = ((e.originalEvent || e).clipboardData || window.clipboardData).getData('Text');
      e.preventDefault();
      document.execCommand('insertText', false, bufferText);
    },
    oninit: function() {
      // Add "open" - "save" buttons

      $('#latexToolbarBtn').remove();
      var noteBtn = '<button id="latexToolbarBtn" type="button" class="btn btn-default btn-sm btn-small" title="LaTeX Equation Editor" data-event="something" tabindex="-1"><span style="font-size:1.3em">&#931;</span></button>';

      var fileGroup = '<div class="note-file btn-group">' + noteBtn + '</div>';

      var sel;
      var cursorPos;
      var oldContent;

      $(fileGroup).appendTo($('.note-toolbar'));
      // Button tooltips
      $('#latexToolbarBtn').tooltip({container: 'body', placement: 'bottom'});
      // Button events
      $('#latexToolbarBtn').click(function(event) {
        sel = window.getSelection();
        if (sel.anchorNode) {
          cursorPos = sel.anchorOffset;
          oldContent = sel.anchorNode.nodeValue;
        }
        $('#latexEditorModal').modal('show');
      });
      $('#insertLatexBtn').click(function(event) {
        event.preventDefault();
        $('#latexEditorModal').modal('hide');
        $('#summernote-compose').summernote({focus:true});

        setTimeout(function(){
          var toInsert = "$"+$('#latex-source').val()+"$";
          //console.log(cursorPos);
          if (!oldContent) {
            $('#summernote-compose').code("<p>"+toInsert+"</p>")
          } else {
            var newContent = oldContent.substring(0, cursorPos) + toInsert + oldContent.substring(cursorPos);
            sel.anchorNode.nodeValue = newContent;
          }
        }, 500);
      });
    }
  });

  if ($(window).width() < 1024) {
    $('.post-list').hide();
  }else{
    $('.post-list').show();
  }


  $(window).resize(function() {
    if ($(window).width() < 1024) {
      $('.post-list').hide();
    }else{
      $('.post-list').show();
    }
  });
}

Template.postCompose.helpers({
  posts: function () {
    return Posts.find({'course_id': Router.current().params.course_id}, {sort: {created_at: -1}});
  }
});


Template.postCompose.events({
  'submit #form-compose': function(e) {
    console.log('hi');
    e.preventDefault();
    var post = {
      title: $(e.target).find('[name=postTitle]').val(),
      text:  $('#summernote-compose').code(),
      isAnonymous: $('#anonymous').is(':checked'),
      course_id: Router.current().params.course_id,
      tags: ""
    };

    //var errors = validatePost(post);
    //if (errors.title || errors.url)
    // return Session.set('postSubmitErrors', errors);

    Meteor.call('postInsert', post, function(error, result) {
      // display the error to the user and abort
      if (error)
      return throwError(error.reason);

      // show this result but route anyway

      Router.go('room', {course_id: Router.current().params.course_id}, {query: "p="+result._id});
    });
  },
  'click .item': function(e) {
    var postId = $(e.currentTarget).attr('data-post-id');
    Router.go('room', {course_id: Router.current().params.course_id}, {query: 'p='+postId});
    loadPage(postId);
  }
});
