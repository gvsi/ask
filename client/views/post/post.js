Template.postList.rendered = function () {

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

Template.postList.helpers({
    posts: function () {
      return Posts.find({}, {sort: {created_at: -1}});
    }
});

Template.postThumbnail.helpers({
    dateFromNow: function() {
        return moment(this.created_at).fromNow();
    }
});


Template.postContent.helpers({
    post: function() {
        return Posts.findOne(Router.current().params.query.p);
    },
    dateFromNow: function(template) {
        var post = Posts.findOne(Router.current().params.query.p, {'created_at': true});
        return moment(post.created_at).fromNow();
    }
});

Template.postContent.events({
    'click #sendCommentBtn': function(e) {
        var body = $('#summernote').code();
        var answer = {
          body: body,
          postId: Router.current().params.query.p
        };
        
        //console.log(answer);
        
        //TODO: Error handling
        /*var errors = {};
        if (! answer.body) {
          errors.body = "Please write some content";
          return Session.set('commentSubmitErrors', errors);
        }*/
        
        Meteor.call('answerInsert', answer, function(error, commentId) {
          if (error){
            throwError(error.reason);
          } else {
            $('#summernote').code("");
          }
        });
    }
});


function loadPage(postId) {
    var post = Posts.findOne(postId);
    var email = null;

    var emailOpened = $('.email-opened');

    $('.no-email').hide();
    $('.actions-dropdown').toggle();
    $('.actions, .email-content-wrapper').show();

    $('#summernote').summernote({
        height: 250,
        onfocus: function(e) {
            $('body').addClass('overlay-disabled');
        },
        onblur: function(e) {
            $('body').removeClass('overlay-disabled');
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