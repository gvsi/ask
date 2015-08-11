Template.postPage.rendered = function () {
  //builds the list only if there are posts

  if (!$("#no-post-error").length) {
    $("#postList").ioslist();
  }

  EasySearch.changeProperty('courseSearch', 'courseId', Router.current().params.courseId);

  loadMathQuill();


  if ($(window).width() < 980) {
    $('.post-list').attr('id', 'slide-left');
  } else {
    $('.post-list').removeAttr('id', 'slide-left');
  }

  if (Router.current().params.query.p) {
    var postId = Router.current().params.query.p;
    Session.set("postId", postId);
    $('.item').removeClass('active');
    $("li[data-post-id="+ postId +"]").addClass('active');

    $('.list-view-wrapper').scrollTop($("li[data-post-id="+ postId +"]").offset().top-92);
    loadPage(postId);
  }

  $(window).resize(function() {
    if ($(window).width() < 980) {
      $('.post-list').attr('id', 'slide-left');
    } else {
      $('.post-list').removeAttr('id', 'slide-left');
    }

    if ($(window).width() > 1024) {
      $('.post-list').length && $('.post-list').removeClass('slideLeft');
    }

  });

  $('[data-toggle="tooltip"]').tooltip();

  var elems = Array.prototype.slice.call(document.querySelectorAll('.switchery'));
  // Success color: #10CFBD
  elems.forEach(function(html) {
    if(html.id == "lectureMode"){
      var switchery = new Switchery(html, {disabled: true});
    }else{
      var switchery = new Switchery(html, {color: '#10CFBD'});
    }
  });

  $('.custom-tag-input').tagsinput({});
  $('#instructorsInput').tagsinput({});
  var instructors = Courses.findOne(Router.current().params.courseId).instructors;

  instructors.forEach(function(instructor){
    if(instructor != Meteor.user().username.toLowerCase()){
      $('#instructorsInput').tagsinput('add', instructor);
    }
  })

  var cts = Session.get('customTags');
  if (cts) {
    cts.forEach(function(tag) {
      $('.custom-tag-input').tagsinput('add', tag);
    });
    Session.set('customTags', undefined)
    $('#customTagsForCourse').show();
  }
}

Template.registerHelper("isUserInstructor", function(){
  var currentCourse = Courses.findOne(Router.current().params.courseId);
  var un = Meteor.user().username.toLowerCase();
  if(currentCourse && (currentCourse.instructors.indexOf(un)!=-1)){
    return true;
  }else{
    return false;
  }
});

Template.registerHelper('equals', function (a, b) {
  return a === b;
});

Template.postPage.helpers({
  posts: function () {
    return Posts.find({'courseId': Router.current().params.courseId}, {sort: {createdAt: -1}});
  },
  courseId: function () {
    return Router.current().params.courseId;
  },
  queryPathFor: function () {
    console.log("q="+this.post._id);
    return "q="+this.post._id;
  }
});

Template.courseSettingsModal.helpers({
  course: function() {
    return Courses.findOne(this.courseId);
  },
  defaultTagsChecked: function(){
    return this.areTagsDefault == true ? "checked" : "";
  },
  loadCustomTags: function() {
    Session.set('customTags', this.tags);
  }
});


Template.courseSettingsModal.events({
  "change #defaultTags": function(e){
    var isDefault = $("#defaultTags")[0].checked;
    var tagAttributes = {
      courseId: this._id,
      areTagsDefault: isDefault,
    };

    Meteor.call('setOrRemoveDefaultTags', tagAttributes, function(error, result) {});

    if (isDefault) {
      //stores custom somewhere if there's change of mind
      var cts = $(".custom-tag-input").tagsinput('items');
      if (cts.length > 0) {
        Session.set('customTags', $(".custom-tag-input").tagsinput('items'));
      }
      $('#customTagsForCourse').hide();
    } else {
      var cts = Session.get('customTags');
      if (cts) {
        $(".custom-tag-input").tagsinput('removeAll');
        cts.forEach(function(ct) {
          $('.custom-tag-input').tagsinput('add', ct);
        });
      }
      $('#customTagsForCourse').show();
      $("#customTagsForCourse>.bootstrap-tagsinput input").focus();
    }

  },
  "itemAdded .custom-tag-input": function(event){
    var tagAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: 1,
      tag: event.item
    };

    Meteor.call('addOrRemoveTag', tagAttributes, function(error, result) {});
  },
  "itemRemoved .custom-tag-input": function(event){
    var tagAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: 0,
      tag: event.item
    };

    Meteor.call('addOrRemoveTag', tagAttributes, function(error, result) {});
  },
  "itemAdded #instructorsInput": function(event){
    var instructorAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: 1,
      instructor: event.item
    };

    Meteor.call('addOrRemoveInstructor', instructorAttributes);
  },
  "itemRemoved #instructorsInput": function(event){
    var instructorAttributes = {
      courseId: Router.current().params.courseId,
      isAdd: 0,
      instructor: event.item
    };

    Meteor.call('addOrRemoveInstructor', instructorAttributes);
  }
});

Template.postList.events({
  'click .item': function(e) {
    $('.item').removeClass('active');
    $(e.currentTarget).addClass('active');
    var postId = $(e.currentTarget).attr('data-post-id');
    Router.go('room', {courseId: Router.current().params.courseId}, {query: 'p='+postId});
    Session.set("postId", postId);
    loadPage(postId);
  }
});

Template.postList.helpers({
  dateGroups: function() {
    var groups = [
      {
        title:'today',
        start: moment().startOf('day'),
        end: moment().endOf('day')
      },
      {
        title:'yesterday',
        start: moment().startOf('day').subtract(1, 'days'),
        end: moment().endOf('day').subtract(1, 'days')
      },
      {
        title:'earlier this week',
        start: moment().startOf('isoweek'),
        end: moment().endOf('day').subtract(2, 'days')
      },
      {
        title:'last week',
        start: moment().startOf('isoweek').subtract(1, 'weeks'),
        end: moment().format('dddd') != 'Monday'? moment().endOf('isoweek').subtract(1, 'weeks') : moment().endOf('isoweek').subtract(8, 'days')
      }
    ];

    var lastPost = Posts.findOne({},{sort:{createdAt:1}, limit:1})
    var startOfLastWeek = moment().startOf('isoweek').subtract(1, 'weeks');

    if (lastPost && lastPost.createdAt < startOfLastWeek) {
      var lastDate = lastPost.createdAt;
      var st = moment(lastDate).startOf('isoweek');
      var en = moment(lastDate).endOf('isoweek');

      while(en <= startOfLastWeek) {

        groups.push({
          title: "week " + st.format("DD/MM") + " - " + en.format("DD/MM"),
          start: moment(st),
          end: moment(en)
        })
        st.add(1, 'weeks');
        en.add(1, 'weeks');
      }
    }
    return groups;
  },
  areTherePosts: function() {
    return Posts.find({'courseId': Router.current().params.courseId}).count() > 0;
  },
  postsByDate: function () {
    return Posts.find({'courseId': Router.current().params.courseId, createdAt: {$gte: this.start.toDate(), $lt: this.end.toDate()}}, {sort: {createdAt: -1}});
  }
})

Template.postThumbnail.helpers({
  dateFromNow: function() {
    return moment(this.createdAt).fromNow();
  },
  textWithoutTags: function() {
    var dummyNode = document.createElement('div'),
    resultText = '';
    dummyNode.innerHTML = this.text;
    resultText = dummyNode.innerText || dummyNode.textContent
    return resultText;
  }
});

Template.postContent.helpers({
  post: function() {
    var postId = Router.current().params.query.p;
    if (!postId) {
      $('.no-post').show();
      $('.post-content-wrapper').hide();
      return false;
    } else {
      var post = Posts.findOne(postId);

      if (post) {
        //if not anonymous
        Meteor.subscribe('singleUser', post.userId);
        var o = Meteor.users.findOne(post.userId);
        if (o) {
          post.ownerName = o.profile.name;
          post.ownerSurname = o.profile.surname;
        }
        return post;
      } else {
        return false;
      }
    }
  },
  currentUserIsOwner: function() {
    var postId = Router.current().params.query.p;
    var post = Posts.findOne(postId);
    if (post)
    if(post.isAnonymous) {
      return post.userIdenticon == Package.sha.SHA256(post._id + Meteor.user()._id)
    } else {
      return post.userId == Meteor.user()._id;
    }
  },
  dateFromNow: function() {
    var post = Posts.findOne(Router.current().params.query.p);
    if (post) {
      if (post.updatedAt && post.createdAt.getTime() == post.updatedAt.getTime()) {
        // the post has never been edited
        return "posted " + moment(post.createdAt).fromNow();
      } else {
        return "updated " + moment(post.updatedAt).fromNow();
      }
    }
  },
  answers: function(){
    // non-reactive answer fetching
    // return the answers from the sorted collection, based on the forced rank
    return tempAnswers.find({}, {
      sort: {rank: 1}});
    },
    errorMessage: function(field) {
      var e = Session.get('answerSubmitErrors');
      if (e)
      return Session.get('answerSubmitErrors')[field];
      else
      return false;
    },
    upvoteButton: function(){
      var postId = Router.current().params.query.p;
      var post = Posts.findOne(postId);
      if (post) {
        var voters = post.upvoters;
        var user = Meteor.user();
        if (voters && user && voters.indexOf(user._id) != -1) {
          return 'btn-success';
        } else {
          return 'btn-default';
        }
      } else {
        return false;
      }
    },
    followButton: function(){
      var postId = Router.current().params.query.p;
      var post = Posts.findOne(postId);
      if (post) {
        var followers = post.followers;
        var user = Meteor.user();
        if (followers && user && followers.indexOf(user._id) != -1) {
          return 'btn-warning';
        } else {
          return 'btn-default';
        }
      } else {
        return false;
      }
    },
    tags: function(){
      var postId = Router.current().params.query.p;
      var post = Posts.findOne(postId);
      if (post) {
        return post.tags;
      }else{
        return false;
      }
    }
  });

  Template.postContent.events({
    'click #sendAnswerBtn': function(e) {
      var body = tinyMCE.get('answerTinyMCE').getContent();
      var answer = {
        body: body,
        postId: Router.current().params.query.p,
        isAnonymous: $('#isAnswerAnonymous').is(':checked')
      };
      console.log(body);
      if (strip_tags(body) == "") {
        var errors = {};
        errors.answerBody = "I know you're trying to be helpful, but an empty answer won't do much...";
        tinyMCE.get('answerTinyMCE').setContent("");
        tinymce.execCommand('mceFocus',false,'answerTinyMCE');
        return Session.set('answerSubmitErrors', errors);
      } else {
        Session.set('answerSubmitErrors', {});
      }

      Meteor.call('answerInsert', answer, function(error, answerId) {
        if (error){
          Session.set('answerSubmitErrors', {answerBody: error.reason});
          throw new Meteor.Error(error.reason);
        } else {
          tinyMCE.get('answerTinyMCE').setContent("");
          //$('#summernote').code("<p><br></p>");
        }
      });
    },
    'click .upvote': function(e) {
      var id = Router.current().params.query.p;
      Meteor.call('upvote', id, function(error) {
        if (error){
          throw new Meteor.error(error.reason);
        } else {
          //$('#' + id).addClass('btn-success').removeClass('btn-default');
        }
      });
    },
    'click #followQuestion': function(e){
      var id = Router.current().params.query.p;
      Meteor.call('followQuestion', id, function(error) {
        if (error){
          throw new Meteor.error(error.reason);
        } else {
          //$('#' + id).addClass('btn-success').removeClass('btn-default');
        }
      });
    },
    "click .post-list-toggle": function(event) {
      $('.post-list').toggleClass('slideLeft');
    },
    "click #openDeleteAnswerModal": function(event){
      Session.set("deleteAnswerId", $(event.currentTarget).data("id"));
    },
    "click #deleteAnswer": function(){
      var id = Session.get("deleteAnswerId");
      Meteor.call("answerDelete", id, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){

        }
      });

      $("#modalDeleteAnswer").modal('hide');
    },
    "click #deletePost": function(){
      var id = Router.current().params.query.p;
      Meteor.call("postDelete", id, function(error, result){
        if(error){
          console.log("error", error);
        }
        if(result){

        }
      });

      Router.go('room', {courseId: Router.current().params.courseId});
    }
  });

  Template.answer.helpers({
    currentUserIsOwner: function() {
      if(this.isAnonymous) {
        return this.userIdenticon == Package.sha.SHA256(this.postId + Meteor.user()._id)
      } else {
        return this.userId == Meteor.user()._id;
      }
    },
    disabledVoteForOwner: function() {
      var currentUserIsOwner;
      if(this.isAnonymous) {
        currentUserIsOwner = this.userIdenticon == Package.sha.SHA256(this.postId + Meteor.user()._id)
      } else {
        currentUserIsOwner = this.userId == Meteor.user()._id;
      }

      if (currentUserIsOwner) {
        return "disabled";
      } else {
        return "";
      }
    },
    isAnonymousChecked: function() {
      if(this.isAnonymous) {
        return "checked";
      } else {
        return "";
      }
    },
    theAuthor: function() {
      //works for both answer and comment
      var authorId = this.userId;
      Meteor.subscribe('singleUser', authorId);
      return Meteor.users.findOne(authorId);
    },
    dateFromNow: function() {
      return moment(this.createdAt).fromNow();
    },
    upvote: function(){
      var answerId = this._id;
      var answer = Answers.findOne(answerId);
      if (answer) {
        var voters = answer.upvoters;
        var userId = Meteor.user()._id;
        if(voters && voters.indexOf(userId) != -1){
          return 'btn-success';
        }
      }
    },
    downvote: function(){
      var answerId = this._id;
      var answer = Answers.findOne(answerId);
      if (answer) {
        var voters = answer.downvoters;
        var userId = Meteor.user()._id;
        if(voters && voters.indexOf(userId) != -1){
          return 'btn-danger';
        }
      }
    }
  });

  Template.answer.events({
    'click #addCommentBtn': function(e) {
      $(".commentTinyMCE-wrapper[data-answer-id="+this._id+"]").toggle();
      //$("#summernote-wrapper-"+this._id).toggle();
      loadTinyMCE("commentTinyMCE-"+this._id, 150);
      tinymce.execCommand('mceFocus',false,"commentTinyMCE-"+this._id);
    },
    'click #sendCommentBtn': function (e) {
      var answerId = $(e.currentTarget).attr('data-answer-id');
      var selector = 'commentTinyMCE-'+answerId;
      var body = tinyMCE.get(selector).getContent();

      var comment = {
        body: body,
        answerId: answerId,
        isAnonymous:  $('#isCommentAnon-'+ answerId).is(':checked')
      };

      if (strip_tags(body) == "") {
        tinyMCE.get(selector).setContent("");
        tinymce.execCommand('mceFocus',false,selector);
        $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("I'm sure this would be a very insightful comment... if it weren't empty.");
        return false;
      } else {
        $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("");
      }

      Meteor.call('commentInsert', comment, function(error) {
        if (error){
          $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text(error.reason);
          throw new Meteor.Error(error.reason);
        } else {
          tinyMCE.get(selector).setContent("");
          $(".commentTinyMCE-wrapper[data-answer-id="+answerId+"]").hide(700);
          $('[data-toggle="tooltip"]').tooltip();
        }
      });
    },
    'click .votingContainer button': function(e) {
      var answerId = $(e.currentTarget).parent().data('answer-id');
      var isUpvote =  $(e.currentTarget).attr('id') == 'upvoteAnswer';

      var voteAttributes = {
        answerId: answerId,
        isUpvote: isUpvote
      };

      Meteor.call('answerVote', voteAttributes, function(error, result) {
        // $('#' + id).addClass('btn-success').removeClass('btn-default');
        //  $(e.currentTarget).parent().find('#answerVoteCount').text(result);
      });
    },
    'click .editAnswerBtn': function(e) {
      var answerId = this._id;
      $(".editAnswerBtn[data-answer-id="+answerId+"]").hide();
      $(".answerBody[data-answer-id="+answerId+"]").hide();
      $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"]").show();
      loadTinyMCE("editAnswerTinyMCE-"+answerId, 200);
    },
    'click .updateAnswerBtn': function(e) {
      var answerId = $(e.currentTarget).attr('data-answer-id');
      var selector = 'editAnswerTinyMCE-'+answerId;
      var body = tinyMCE.get(selector).getContent();

      var answer = {
        answerId: answerId,
        body: body,
        postId: Router.current().params.query.p,
        isAnonymous: $('#isAnswerAnonymous-edit-'+answerId).is(':checked')
      };

      if (strip_tags(body) == "") {
        var errors = {};
        tinyMCE.get(selector).setContent("");
        tinymce.execCommand('mceFocus',false,selector);
        $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("I know you're trying to be helpful, but an empty answer won't do much...");
        return false;
      } else {
        $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text("");
      }

      Meteor.call('answerUpdate', answer, function(error, answerId) {
        if (error){
          $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"] .error").text(error.reason);
          throw new Meteor.Error(error.reason);
        } else {
          $(".editAnswerBtn[data-answer-id="+answerId+"]").show();
          $(".answerBody[data-answer-id="+answerId+"]").show();
          $(".editAnswerTinyMCE-wrapper[data-answer-id="+answerId+"]").hide();
        }
      });
    },
    'click .cancelUpdateBtn': function(e) {
      $(".editAnswerBtn[data-answer-id="+this._id+"]").show();
      $(".answerBody[data-answer-id="+this._id+"]").show();
      $(".editAnswerTinyMCE-wrapper[data-answer-id="+this._id+"]").hide();
    }
  });


  function loadPage(postId) {
    Session.set('answerSubmitErrors', {});

    Meteor.subscribe('singlePost', postId, {
      onReady: function() {
        var postOpened = $('.post-opened');

        $('.no-post').hide();
        $('.post-content-wrapper').show();

        loadTinyMCE("answerTinyMCE", 150);

        $(".post-content-wrapper").scrollTop(0);

        // Initialize post action menu
        $('.menuclipper').menuclipper({
          bufferWidth: 20
        });

        $('#slide-left').addClass('slideLeft');

        setTimeout(function(){
          $('[data-toggle="tooltip"]').tooltip();
        }, 1000);

        setTimeout(function () {
          console.log("init highlight");
          $('pre code').each(function(i, block) {
            hljs.highlightBlock(block);
          });
        }, 100);
      }
    }
    );
  }

  function initialiseSummernote(selector) {
    $(selector).destroy();
    $(selector).summernote({
      height: 150,
      onfocus: function(e) {
        //$('body').addClass('overlay-disabled');
      },
      onblur: function(e) {
        //$('body').removeClass('overlay-disabled');
      },
      onpaste: function(e) {
        var bufferText = (e.originalEvent.clipboardData).getData('Text');
        e.preventDefault();
        document.execCommand('insertText', false, bufferText);
      },
      toolbar: [
        ['misc', ['hello', 'undo','redo','fullscreen']],
        ['style', ['bold', 'italic', 'underline']],
        ['insert', ['picture', 'link']],
        ['para', ['ul', 'ol', 'paragraph']]
      ],
      oninit: function() {
        // Add "open" - "save" buttons
        $(selector).parent().find('.note-file .latexToolbarBtn').remove()

        var noteBtn = '<button type="button" class="btn btn-default btn-sm btn-small latexToolbarBtn" title="LaTeX Equation Editor" data-event="something" tabindex="-1"><span style="font-size:1.3em">&#931;</span></button>';

        var fileGroup = '<div class="note-file btn-group">' + noteBtn + '</div>';

        var sel;
        var cursorPos;
        var oldContent;

        $(fileGroup).appendTo($(selector).parent().find(".note-toolbar"));
        // Button tooltips
        $('.latexToolbarBtn').tooltip({container: 'body', placement: 'bottom'});
        // Button events
        $('.latexToolbarBtn').click(function(event) {
          $('#insertLatexBtn').attr('data-current-selector', "#" + $(event.currentTarget.parentNode.parentNode.parentNode.previousSibling).attr('id'));
          sel = window.getSelection();
          if (sel.anchorNode) {
            cursorPos = sel.anchorOffset;
            oldContent = sel.anchorNode.nodeValue;
          }
          $('#latexEditorModal').modal('show');
        });
        $('#insertLatexBtn').click(function(event) {
          $('#latexEditorModal').modal('hide');

          if (selector == $('#insertLatexBtn').attr("data-current-selector")) {
            console.log('true' + selector);
            console.log(oldContent);
            console.log(cursorPos);
            $(selector).summernote({focus:true});

            setTimeout(function(){
              var toInsert = "$"+$('#latex-source').val()+"$";
              if (!oldContent) {
                $(selector).code("<p>"+toInsert+"</p>")
              } else {
                var newContent = oldContent.substring(0, cursorPos) + toInsert + oldContent.substring(cursorPos);
                sel.anchorNode.nodeValue = newContent;
              }
            }, 500);
          } else {
            console.log('false' + selector);
          }
        });
      }
    });
  }
  //removes all tags and whitespaces (&nbsp;)
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

  function loadMathQuill() {
    mathquill();
    var LatexImages = false;
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
  }

  // Special collection for holding the temporarily sorted answers
  tempAnswers = new Meteor.Collection(null);

  // rebuild the sorted results collection, on each page
  Deps.autorun(function(){
    var postId = Session.get("postId");
    //console.log(postId);
    if (postId) {
      Meteor.subscribe('answers', postId, {
        onReady: function() {
          tempAnswers.remove({});
          // observe is automatically torn down when computation is invalidated
          // add each of the items with an enforced rank

          var currentRank = 0;
          var initial = true;
          Answers.find({}, {sort: {isInstructor: -1, isInstructorUpvoted: -1, voteCount: -1, createdAt: 1}}).observe({
            addedAt: function(document, atIndex){
              if(initial){
                document.rank = atIndex;
                currentRank = Math.max(currentRank, atIndex + 1);
                //console.log("added initial - id: " + document._id + " rank: " + document.rank + " currentRank: " + currentRank + " voteCount: " + document.voteCount);
                tempAnswers.insert(document)
              } else {
                document.rank = currentRank++;
                if (!tempAnswers.findOne(document._id))
                tempAnswers.insert(document);
              }
            },
            removed: function(document){
              //console.log('removed id: ' + document._id);
              tempAnswers.remove(document._id);
            },
            changed: function(document){
              var id = document._id;
              delete document._id;
              tempAnswers.update(id, {$set: document}); // keeps rank field
            }
          });
          //console.log("initial set to false");
          initial = false;
        }
      });
    }
  });

  loadTinyMCE = function(selector, height) {
  console.log(selector);
    tinymce.EditorManager.execCommand('mceRemoveEditor',true, selector);
    //$("#summernote-wrapper").append('<textarea id="tinymceTextArea" name="content"></textarea>');
    tinymce.init({
      selector: "#" + selector,
      plugins: "link , image, sh4tinymce, equationeditor",
      min_height: height,
      content_css: '/tinymce/plugins/equationeditor/mathquill.css',
      menu: {},
      menubar: false,
      toolbar: "undo | redo | bold | italic | underline | alignleft | aligncenter | alignright | alignjustify | link | unlink | image | sh4tinymce | equationeditor |",
      preview_styles: false,
      elementpath: false
    });
  }
