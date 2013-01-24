(function($){
// *****************
//  MODELS
// *****************
	var Post = Backbone.Model.extend({
		defaults: {
			id: '0',
			postUrl: '',
			type: '',
			reblogKey: ''
		}
	});

	var Header = Backbone.Model.extend({
		defaults: {
			showFullHeader: true
		}
	});

	var FullWindow = Backbone.Model.extend({
		defaults: {
			scrollAmount: 0
		}
	});

// *****************
//  COLLECTIONS
// *****************
	var Posts = Backbone.Collection.extend({
		model: Post
	});

// *****************
//  VIEWS
// *****************
	var PostsView = Backbone.View.extend({
		el: $('.posts'),

		initialize: function() {
			_.bindAll(this, 'render');

			this.collection = new Posts();

			var $posts = this.$el.find('.post');

			this.render($posts);
		},

		render: function($posts) {
			var view = this;

			_($posts).each(function(postElement){
				var
					$postElement = $(postElement),
					post = new Post({
						id: $postElement.attr('data-post-id'),
						postUrl: $postElement.attr('data-post-url'),
						type: $postElement.attr('data-post-type'),
						reblogKey: $postElement.attr('data-post-reblogurl').split($postElement.attr('data-post-id') + '/')[1]
					})
				;

				view.collection.add(post);

				new PostView({
					el: $postElement,
					model: post
				});
			});
		}
	});

	var PostView = Backbone.View.extend({
		initialize: function() {
			var
				$triangle = this.$el.find('.triangle'),
				canvas = $triangle.get(0)
			;

			if (canvas && canvas.getContext) {
				var context = canvas.getContext('2d');

				if (context) {
					context.beginPath();

					// Start from the top-left point.
					context.lineTo(50, 50); // give the (x,y) coordinates
					context.lineTo(25, 25);
					context.lineTo(50, 0);
					context.lineTo(50, 50);

					// Done! Now fill the shape, and draw the stroke.
					// Note: your shape will not be visible until you call any of the two methods.
					context.fill();
					context.closePath();
				}
			}
		},

		events: {
			'click .caption': function() { 
				alert('asdf');
			}
		}
	});

	var HeaderView = Backbone.View.extend({
		el: $('#header'),

		initialize: function() {
			_.bindAll(this, 'render');

			this.listenTo(this.model, "change", this.render);

			this.render();
		},

		render: function() {
			this.$el.find('.navbar').toggleClass('navbar-fixed-top', !this.model.get('showFullHeader'));
		}
	});

	var FullWindowView = Backbone.View.extend({
		el: $(window),

		initialize: function() {
			_.bindAll(this, 'detect_scroll');

			// bind to window
			this.$el.scroll(this.detect_scroll);
		},

		detect_scroll: function() {
			this.model.set({
				scrollAmount: this.$el.scrollTop()
			});
		}
	});

	var AppView = Backbone.View.extend({
		initialize: function() {
			var
				scrollAmount = $(window).scrollTop(),
				postsView = new PostsView(),
				fullWindowView = new FullWindowView({
					model: new FullWindow({
						scrollAmount: scrollAmount
					})
				}),
				headerView = new HeaderView({
					model: new Header()
				})
			;

			headerView.model.set({
				showFullHeader: scrollAmount < headerView.$el.find('h1').height()
			});

			fullWindowView.model.on('change:scrollAmount', function(model, scrollAmount) {
				headerView.model.set({
					showFullHeader: scrollAmount < headerView.$el.find('h1').height()
				});
			});
		}
	});

	var appView = new AppView();
})(jQuery);