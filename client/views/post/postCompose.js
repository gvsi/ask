Template.postCompose.rendered = function(){
  Session.set("DocumentTitle", "Compose | Ask");

  mathquill();

  if ($(window).width() < 1024) {
    $('.postListContainer').hide();
  }else{
    $('.postListContainer').show();
  }


  $(window).resize(function() {
    if ($(window).width() < 1024) {
      $('.postListContainer').hide();
    }else{
      $('.postListContainer').show();
    }
  });

  var postId = Router.current().params.query.p;
  var isEditing = postId != "" && Posts.findOne(postId);

  Meteor.subscribe('draft', Router.current().params.courseId, "post", {
    onReady: function() {
      loadTinyMCE("composeTinyMCE", 400);

      setTimeout(function () {
        var draft = Drafts.findOne({courseId: Router.current().params.courseId, userId: Meteor.userId(), type: "post"});

        if (!isEditing) {
          if (draft) {
            tinyMCE.get('composeTinyMCE').setContent(draft.body);
          } else {
            tinyMCE.get('composeTinyMCE').setContent("");
          }
        }
      }, 500);
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
  },
  draftTitle: function() {
    var draft = Drafts.findOne({courseId: Router.current().params.courseId, userId: Meteor.userId(), type: "post"});
    if (draft) {
      return draft.title;
    } else {
      return "";
    }
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
      errors.compose = "You should add a brief description to your question (at least 20 characters)";
      tinyMCE.get('composeTinyMCE').setContent("");
      tinymce.execCommand('mceFocus',false,'composeTinyMCE');
      return Session.set('postSubmitError', errors);
    } else if (textLength < 20 || textLength > 50000) {
      errors.compose = "The description cannot be shorter than 20 characters (you have <strong>" + textLength + "</strong> now)";
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
        Session.set('postSubmitError', {compose: error.reason});
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
  'click #saveDraftBtn': function(e) {
    e.preventDefault();

    var body = tinyMCE.get('composeTinyMCE').getContent();
    var post = {
      title: $("#postTitleInput").val(),
      body: body,
      courseId: Router.current().params.courseId,
    };
    if (strip_tags(body) == "" && post.title == "") {
      var errors = {};
      errors.compose = "There's nothing to save as a draft. Write something first.";
      tinyMCE.get('composeTinyMCE').setContent("");
      tinymce.execCommand('mceFocus',false,'answerTinyMCE');
      return Session.set('postSubmitError', errors);
    }

    Meteor.call('savePostDraft', post, function(error, result) {
      if (error){
        Session.set('postSubmitError', {compose: error.reason});
        throw new Meteor.Error(error.reason);
      } else {
        if (result) {
          $("#saveDraftBtn").html("Saved!");
          $("#saveDraftBtn").removeClass('btn-default').addClass('btn-success');
          setTimeout(function () {
            $("#saveDraftBtn").html("Save draft");
            $("#saveDraftBtn").removeClass('btn-success').addClass('btn-default');
          }, 2000);
        }

      }
    });
  }
});
