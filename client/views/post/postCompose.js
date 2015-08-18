Template.postCompose.rendered = function(){
  if (!$("#no-post-error").length) {
    $("#postList").ioslist();
  }

  Session.set("DocumentTitle", "Compose | Ask");

  loadTinyMCE("composeTinyMCE", 400);

  mathquill();

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
    return Posts.find({'courseId': Router.current().params.courseId}, {sort: {createdAt: -1}});
  },
  course: function() {
    return Courses.findOne(Router.current().params.courseId);
  },
  isEditingPost: function() {
    var postId = Router.current().params.query.p;
    return postId != "" && Posts.findOne(postId);
  },
  isTagActive: function() {
    var postId = Router.current().params.query.p;
    Meteor.subscribe('singlePost', postId)
    var tags = Posts.findOne(postId).tags;
    if (tags && tags.indexOf(this.valueOf()) > -1) {
      return "active";
    } else {
      return "";
    }
  },
  editingPost: function() {
    var post = Posts.findOne(Router.current().params.query.p);
    if (post) {
      return post;
    } else {
      return false;
    }
  },
  isAnonymousChecked: function() {
    var postId = Router.current().params.query.p;
    var post = Posts.findOne(postId);

    if (post && post.isAnonymous) {
      return "checked"
    } else {
      return "";
    }
  },
  errorMessage: function(field) {
    var e = Session.get('postSubmitError');
    if (e)
    return Session.get('postSubmitError')[field];
    else
    return false;
  }
});


Template.postCompose.events({
  'click #composeSubmitBtn': function(e) {
    e.preventDefault();
    var type = $(e.currentTarget).attr('data-type-form');

    var tags=[];

    $("#postTags>.active").each(function() {
      tags.push($( this ).text().trim());
    });

    var tinymceText = tinyMCE.get('composeTinyMCE').getContent();

    var post = {
      title: $("#postTitleInput").val(),
      text: tinymceText,
      isAnonymous: $('#anonymous').is(':checked'),
      courseId: Router.current().params.courseId,
      tags: tags
    };

    var errors = {};

    var titleLength = post.title.trim().length;
    var textLength = strip_tags(post.text).length;

    if (titleLength == 0) {
      errors.compose = "Add a title to your question (at least 5 characters)";
      tinymce.execCommand('mceFocus',false,'composeTinyMCE');
      return Session.set('postSubmitError', errors);
    } else if (titleLength < 5 || titleLength > 60) {
      errors.compose = "The title cannot be shorter than 5 characters or longer than 60 characters (you have <strong>" + titleLength + "</strong> now)";
      tinymce.execCommand('mceFocus',false,'composeTinyMCE');
      return Session.set('postSubmitError', errors);
    } else if (textLength == 0) {
      errors.compose = "You should add a brief description to your question (at least 30 characters)";
      tinyMCE.get('composeTinyMCE').setContent("");
      tinymce.execCommand('mceFocus',false,'composeTinyMCE');
      return Session.set('postSubmitError', errors);
    } else if (textLength < 30 || textLength > 50000) {
      errors.compose = "The description cannot be shorter than 30 characters (you have <strong>" + textLength + "</strong> now)";
      tinymce.execCommand('mceFocus',false,'composeTinyMCE');
      return Session.set('postSubmitError', errors);
    } else {
      // no error
      Session.set('postSubmitError', {});
    }

    if (type == "postUpdate") {
      var post = _.extend(post, {
        postId: Router.current().params.query.p
      });
    }

    Meteor.call(type, post, function(error, result) {
      // display the error to the user and abort
      if (error) {
        Session.set('postSubmitError', {answerBody: error.reason});
        throw new Meteor.Error(error.reason);
      } else {
        Router.go('room', {courseId: Router.current().params.courseId}, {query: "p="+result._id});
      }
    });
  },
  'click #cancelUpdateBtn': function(e) {
    e.preventDefault();
    Router.go('room', {courseId: Router.current().params.courseId}, {query: "p="+Router.current().params.query.p});
  },
  'click #previewButton': function(e) {
    e.preventDefault();
    $("#previewTitle").text($('#postTitleInput').val());
    $("#previewContent").html(tinyMCE.get('composeTinyMCE').getContent());
    $("#postTags>.active").each(function() {
       $("#previewTags").append('<button class="btn btn-tag btn-tag-light m-r-5">' + $( this ).text().trim() + '</button>');
    });

    $('#previewContent pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
    MathJax.Hub.Queue(["Typeset",MathJax.Hub]);
  },
  'click .item': function(e) {
    var postId = $(e.currentTarget).attr('data-post-id');
    Router.go('room', {courseId: Router.current().params.courseId}, {query: 'p='+postId});
  }
});
