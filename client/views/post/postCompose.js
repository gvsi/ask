Template.postCompose.rendered = function(){
  if (!$("#no-post-error").length) {
    $("#postList").ioslist();
  }

  tinymce.EditorManager.execCommand('mceRemoveEditor',true, "tinymceTextArea");
  $("#summernote-wrapper").append('<textarea id="tinymceTextArea" name="content"></textarea>');
  tinymce.init({
       selector: "#tinymceTextArea",
       plugins: "link , image, sh4tinymce, equationeditor",
       min_height: 400,
       content_css: '/tinymce/plugins/equationeditor/mathquill.css',
       menu: {},
       menubar: false,
       toolbar: "undo | redo | bold | italic | underline | alignleft | aligncenter | alignright | alignjustify | link | unlink | image | sh4tinymce | equationeditor |",
       resize: false,
       preview_styles: false,
       statusbar: false,
   });




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

    var tinymceText = tinyMCE.get('tinymceTextArea').getContent();

    var post = {
      title: $("#postTitleInput").val(),
      text: tinymceText,
      isAnonymous: $('#anonymous').is(':checked'),
      courseId: Router.current().params.courseId,
      tags: tags
    };

    if (type == "postUpdate") {
      var post = _.extend(post, {
        postId: Router.current().params.query.p
      });
    }

    Meteor.call(type, post, function(error, result) {
      // display the error to the user and abort
      if (error)
        throw new Meteor.Error(error.reason);
      // show this result but route anyway
      Router.go('room', {courseId: Router.current().params.courseId}, {query: "p="+result._id});
    });
  },
  'click .item': function(e) {
    var postId = $(e.currentTarget).attr('data-post-id');
    Router.go('room', {courseId: Router.current().params.courseId}, {query: 'p='+postId});
  }
});
