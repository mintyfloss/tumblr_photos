var MF = MF || {};

// *****************
//  MODELS
// *****************
	MF.App = Backbone.Model.extend({
		defaults: {
			page: 1
		}
	});

	MF.Post = Backbone.Model.extend({
		defaults: {
			id: '0',
			postUrl: '',
			type: '',
			reblogKey: ''
		}
	});

// *****************
//  COLLECTIONS
// *****************
	MF.Posts = Backbone.Collection.extend({
		model: MF.Post
	});

// *****************
//  VIEWS
// *****************
	MF.PostsView = Backbone.View.extend({
		el: $('.posts'),

		initialize: function($postViewRef) {
			_.bindAll(this, 'render');

			this.collection = new MF.Posts();

			this.postViews = [];

			var $posts = this.$el.find('.post');

			this.render($posts, $postViewRef);
		},

		render: function($posts, $postViewRef) {
			var view = this;

			_($posts).each(function(postElement){
				var
					$postElement = $(postElement),
					postModel = new MF.Post({
						id: $postElement.attr('data-post-id'),
						postUrl: $postElement.attr('data-post-url'),
						type: $postElement.attr('data-post-type'),
						reblogKey: $postElement.attr('data-post-reblogurl').split($postElement.attr('data-post-id') + '/')[1]
					}),
					postView = null
				;

				view.collection.add(postModel);

				if ($postViewRef) {
					postView = new $postViewRef({
						el: $postElement,
						model: postModel
					});
				} else {
					postView = new MF.PostView({
						el: $postElement,
						model: postModel
					});
				}

				view.postViews.push(postView);
			});

			return this;
		},

		loadMorePostsInPage: function() {

		}
	});

	MF.PostView = Backbone.View.extend({
		initialize: function() {
		}
	});

	MF.AppView = Backbone.View.extend({
		initialize: function() {
			new MF.PostsView();
		}
	});