Template.postPage.rendered = function () {
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


    if ($(window).width() < 980) {
        $('.email-list').attr('id', 'slide-left');
    } else {
        $('.email-list').removeAttr('id', 'slide-left');
    }

    if (Router.current().params.query.p) {
        var postId = Router.current().params.query.p;
        loadPage(postId);
    }

    $('#mark-email').click(function() {
        $('.item .checkbox').toggle();
    });

    // Toggle email sidebar on mobile view
    $('.toggle-email-sidebar').click(function(e) {
        e.stopPropagation();
        $('.email-sidebar').toggle();
    });

    $('.email-list-toggle').click(function() {
        $('.email-list').toggleClass('slideLeft');
    });

    $('.email-sidebar').click(function(e) {
        e.stopPropagation();
    })

    $(window).resize(function() {
        if ($(window).width() < 980) {
            $('.email-list').attr('id', 'slide-left');
        }else{
            $('.email-list').removeAttr('id', 'slide-left');
        }

        if ($(window).width() <= 1024) {
            $('.email-sidebar').hide();

        } else {
            $('.email-list').length && $('.email-list').removeClass('slideLeft');
            $('.email-sidebar').show();

        }

    });
}

Template.postList.events({
    'click .item': function(e) {
        $('.item').removeClass('active');
        //console.log(e.currentTarget);
        $(e.currentTarget).addClass('active');
        var postId = $(e.currentTarget).attr('data-post-id');
        Router.go('room', {course_id: Router.current().params.course_id}, {query: 'p='+postId});
        loadPage(postId);
    }
});


Template.postPage.helpers({
  posts: function () {
    return Posts.find({'course_id': Router.current().params.course_id}, {sort: {created_at: -1}});
  },
  course_id: function () {
    return Router.current().params.course_id;
  }
});

Template.postThumbnail.helpers({
    dateFromNow: function() {
        return moment(this.created_at).fromNow();
    }
});




Template.postContent.helpers({
    post: function() {
        var postId = Router.current().params.query.p;
        if (!postId) {
            $('.no-email').show();
            $('.email-content-wrapper').hide();
            return false;
        } else {
            var post = Posts.findOne(postId);

            //if not anonymous
            Meteor.subscribe('singleUser', post.owner);
            var o = Meteor.users.findOne(post.owner);
            if (o) {
                post.ownerName = o.profile.name;
                post.ownerSurname = o.profile.surname;
            }
            return post;
        }
    },
    dateFromNow: function() {
        var post = Posts.findOne(Router.current().params.query.p, {'created_at': true});
        if (post) {
            return moment(post.created_at).fromNow();
        }
    },
    answers: function() {
        var id = Router.current().params.query.p;
        Meteor.subscribe('answers', id);
        return Answers.find({},{sort:{created_at:1}});
    },
    errorMessage: function(field) {
        var e = Session.get('answerSubmitErrors');
        if (e)
         return Session.get('answerSubmitErrors')[field];
        else
         return false;
    },
    button: function(){
        var postId = Router.current().params.query.p;
        var post = Posts.findOne(postId);
        if (post) {
            var voters = post.upvoters;
            var userId = Meteor.user()._id;
            if(voters && voters.indexOf(userId) != -1){
                return 'btn-success';
            }else{
                 return 'btn-default';
            }
        } else {
            return false;
        }
    }
});

Template.postContent.events({
    'click #sendAnswerBtn': function(e) {
        var body = $('#summernote').code();
        var answer = {
          body: body,
          postId: Router.current().params.query.p
        };

        if (strip_tags(body) == "") {
          var errors = {};
          errors.answerBody = "I know you're trying to be helpful, but an empty answer won't do much...";
          $('#summernote').code("<p><br></p>");
          $('#summernote').summernote({focus: true});
          return Session.set('answerSubmitErrors', errors);
        } else {
          Session.set('answerSubmitErrors', {});
        }

        Meteor.call('answerInsert', answer, function(error, answerId) {
          if (error){
              Session.set('answerSubmitErrors', {answerBody: error.reason});
              throw new Meteor.Error(error.reason);
          } else {
              $('#summernote').code("<p><br></p>");
          }
        });
  },
  'click .upvote': function(e) {
          var id = Router.current().params.query.p;
          Meteor.call('upvote', id, function(error, commentId) {
          if (error){
            throw new Meteor.error(error.reason);
          } else {
             $('#' + id).addClass('btn-success').removeClass('btn-default');
          }
        });
   }
});

Template.answer.helpers({
    answerAuthor: function() {
        var authorId = this.userId;
        Meteor.subscribe('singleUser', authorId);
        return Meteor.users.findOne(authorId);
    },
    dateFromNow: function() {
        return moment(this.created_at).fromNow();
    }
})

Template.answer.events({
  'click #addCommentBtn': function(e) {
    $("#summernote-wrapper-"+this._id).toggle();
    //$(e.currentTarget.parentElement).append("<div class=\"summernote-wrapper pull-right\" style=\"width:90%\"><p><div id=\"summernote-"+this._id+"\"></div></p></div>");
    $('#summernote-'+this._id).destroy();
    $('#summernote-'+this._id).summernote({
        height: 90,
        onfocus: function(e) {
            $('body').addClass('overlay-disabled');
        },
        onblur: function(e) {
            $('body').removeClass('overlay-disabled');
        },
        onpaste: function(e) {
            var bufferText = (e.originalEvent.clipboardData).getData('Text');
            e.preventDefault();
            document.execCommand('insertText', false, bufferText);
        },
        toolbar: [
        ['misc', ['undo','redo']],
        ['style', ['bold', 'italic', 'underline']],
        ['insert', ['link']],
        ]
    });
  },
  'click #sendCommentBtn': function (e) {
    var answerId = $(e.currentTarget).attr('data-answer-id');

    var body = $('#summernote-'+answerId).code();

    var comment = {
      body: body,
      answerId: answerId
    };

    if (strip_tags(body) == "") {
      $('#summernote-'+answerId).code("<p><br></p>");
      $('#summernote-'+answerId).summernote({focus: true});
      $('#summernote-wrapper-'+answerId+' .error').text("I'm sure this would be a very insightful comment... if it weren't empty.");
      return false;
    } else {
      $('#summernote-wrapper-'+answerId+' .error').text("");
    }

    Meteor.call('commentInsert', comment, function(error, res) {
      if (error){
          $('#summernote-wrapper-'+answerId+' .error').text(error.reason);
          throw new Meteor.Error(error.reason);
      } else {
          console.log(res);
          //$('#summernote-'+answerId).code("<p><br></p>");
      }
    });
  }
})


function loadPage(postId) {
    Session.set('answerSubmitErrors', {});
    Session.set('commentSubmitErrors', {});

    Meteor.subscribe('singlePost', postId);

    var workoutsSubcription = Meteor.subscribe('singlePost', postId);


    var post = Posts.findOne(postId);
    var email = null;

    var emailOpened = $('.email-opened');

    $('.no-email').hide();
    $('.email-content-wrapper').show();

    $('#summernote').destroy();
    $('#summernote').summernote({
        height: 150,
        onfocus: function(e) {
            $('body').addClass('overlay-disabled');
        },
        onblur: function(e) {
            $('body').removeClass('overlay-disabled');
        },
        onpaste: function(e) {
            var bufferText = (e.originalEvent.clipboardData).getData('Text');
            e.preventDefault();
            document.execCommand('insertText', false, bufferText);
        },
        toolbar: [
        ['misc', ['undo','redo','fullscreen']],
        ['style', ['bold', 'italic', 'underline']],
        ['insert', ['picture', 'link']],
        ['fontsize', ['fontsize']],
        ['para', ['ul', 'ol', 'paragraph']]
        ],
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
                $('#latexEditorModal').modal('hide');
                $('#summernote').summernote({focus:true});

                setTimeout(function(){
                    var toInsert = "$"+$('#latex-source').val()+"$";
                    //console.log(cursorPos);
                    if (!oldContent) {
                        console.log("asd");
                        $('#summernote').code("<p>"+toInsert+"</p>")
                    } else {
                        var newContent = oldContent.substring(0, cursorPos) + toInsert + oldContent.substring(cursorPos);
                        sel.anchorNode.nodeValue = newContent;
                    }
                }, 500);

             });
        }
    });



    var body = $('#summernote').code();
    $(".email-content-wrapper").scrollTop(0);

    // Initialize email action menu
    $('.menuclipper').menuclipper({
        bufferWidth: 20
    });

    $('#slide-left').addClass('slideLeft');


}

//removes all tags and whitespaces (&nbsp;) to make sure
function strip_tags(input, allowed) {
  allowed = (((allowed || '') + '')
      .toLowerCase()
      .match(/<[a-z][a-z0-9]*>/g) || [])
  .join(''); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
  var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
  commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
  return input.replace(commentsAndPhpTags, '')
  .replace(tags, function($0, $1) {
    return allowed.indexOf('<' + $1.toLowerCase() + '>') > -1 ? $0 : '';
  }).replace(/&nbsp;/gi,'').replace(/\s+/g, ''); // removes spaces and &nbsp;
}
