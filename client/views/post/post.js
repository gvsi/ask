Template.postPage.rendered = function () {

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
        var postId = $(e.currentTarget).attr('data-email-id');
        Router.go('room', {course_id: Router.current().params.course_id}, {query: 'p='+postId});
        loadPage(postId);
        $('#summernote').code(""); //cleaning answer form       
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
        return Answers.find();
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

      if (strip_tags(body) == "") {
        var errors = {};
        errors.body = "I know you're trying to be helpful, but an empty answer won't do much...";
        $('#summernote').code("");
        $('#summernote').summernote({focus: true});
        return Session.set('answerSubmitErrors', errors);
      } else {
        Session.set('answerSubmitErrors', {});
      }

      Meteor.call('answerInsert', answer, function(error, answerId) {
        if (error){
            throw new Meteor.Error(error.reason);
        } else {
            $('#summernote').code("");
        }
      });
  },
  'click .upvote': function(e) {
          var id = Router.current().params.query.p;
          Meteor.call('upvote', id, function(error, commentId) {
          if (error){
            throwError(error.reason);
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
    }
})


function loadPage(postId) {
    Session.set('answerSubmitErrors', {});
    Meteor.subscribe('singlePost', postId);

    var workoutsSubcription = Meteor.subscribe('singlePost', postId);

    var post = Posts.findOne(postId);
    var email = null;

    var emailOpened = $('.email-opened');

    $('.no-email').hide();
    $('.email-content-wrapper').show();

    $('#summernote').summernote({
        height: 150,
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
        toolbar: [
        ['misc', ['undo','redo','fullscreen']],
        ['style', ['bold', 'italic', 'underline']],
        ['insert', ['picture', 'link']],
        ['fontsize', ['fontsize']],
        ['para', ['ul', 'ol', 'paragraph']]
        ]
    });

    $(".email-content-wrapper").scrollTop(0);

    // Initialize email action menu 
    $('.menuclipper').menuclipper({
        bufferWidth: 20
    });

    $('.item').removeClass('active');
    $(this).addClass('active');

    $('#slide-left').addClass('slideLeft'); 
}