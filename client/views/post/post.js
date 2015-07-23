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
            post.ownerName = o.profile.name;
            post.ownerSurname = o.profile.surname;

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

Template.answer.helpers({
    answerAuthor: function() {
        var authorId = this.userId;
        Meteor.subscribe('singleUser', authorId);
        return Meteor.users.findOne(authorId);
    }
})

function loadPage(postId) {

    Meteor.subscribe('singlePost', postId);


    var post = Posts.findOne(postId);
    var email = null;

    var emailOpened = $('.email-opened');

    $('.no-email').hide();
    $('.email-content-wrapper').show();

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