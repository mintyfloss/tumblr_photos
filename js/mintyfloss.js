var mfTumblr = mfTumblr || {};

// *****************
//  MODELS
// *****************
	mfTumblr.Post = Backbone.Model.extend({
		defaults: {
			id: '0',
			postUrl: '',
			type: '',
			reblogKey: ''
		}
	});

	mfTumblr.Header = Backbone.Model.extend({
		defaults: {
			showFullHeader: true
		}
	});

	mfTumblr.FullWindow = Backbone.Model.extend({
		defaults: {
			scrollAmount: 0
		}
	});

// *****************
//  COLLECTIONS
// *****************
	mfTumblr.Posts = Backbone.Collection.extend({
		model: mfTumblr.Post
	});

// *****************
//  VIEWS
// *****************
	mfTumblr.PostsView = Backbone.View.extend({
		el: $('.posts'),

		initialize: function() {
			_.bindAll(this, 'render');

			this.collection = new mfTumblr.Posts();

			var $posts = this.$el.find('.post');

			this.render($posts);
		},

		render: function($posts) {
			var view = this;

			_($posts).each(function(postElement){
				var
					$postElement = $(postElement),
					post = new mfTumblr.Post({
						id: $postElement.attr('data-post-id'),
						postUrl: $postElement.attr('data-post-url'),
						type: $postElement.attr('data-post-type'),
						reblogKey: $postElement.attr('data-post-reblogurl').split($postElement.attr('data-post-id') + '/')[1]
					})
				;

				view.collection.add(post);

				new mfTumblr.PostView({
					el: $postElement,
					model: post
				});
			});
		}
	});

	mfTumblr.PostView = Backbone.View.extend({
		initialize: function() {
			// var
			// 	$triangle = this.$el.find('.triangle'),
			// 	canvas = $triangle.get(0)
			// ;

			// if (canvas && canvas.getContext) {
			// 	var context = canvas.getContext('2d');

			// 	if (context) {
			// 		context.beginPath();

			// 		// Start from the top-left point.
			// 		context.lineTo(50, 50); // give the (x,y) coordinates
			// 		context.lineTo(25, 25);
			// 		context.lineTo(50, 0);
			// 		context.lineTo(50, 50);

			// 		// Done! Now fill the shape, and draw the stroke.
			// 		// Note: your shape will not be visible until you call any of the two methods.
			// 		context.fill();
			// 		context.closePath();
			// 	}
			// }
		},

		events: {
			'click .caption': function() { 
				alert('asdf');
			}
		}
	});

	mfTumblr.HeaderView = Backbone.View.extend({
		el: $('#header'),

		initialize: function() {
			_.bindAll(this, 'render');

			this.listenTo(this.model, "change", this.render);

			this.render();
		},

		render: function() {
			this.$el.find('.navbar').toggleClass('navbar-fixed-top', !this.model.get('showFullHeader'));

			this.$el.find('#toTop').click(function() {
				$('html:not(:animated), body:not(:animated)').animate({ scrollTop: 0 }, 'slow');
			});
		}
	});

	mfTumblr.FullWindowView = Backbone.View.extend({
		el: $(window),

		initialize: function() {
			_.bindAll(this, 'detect_scroll');

			// debounce function that happens with scroll event
			this.$el.scroll(_.debounce(this.detect_scroll, 80));
		},

		detect_scroll: function() {
			this.model.set({
				scrollAmount: this.$el.scrollTop()
			});
		}
	});

	mfTumblr.AppView = Backbone.View.extend({
		initialize: function() {
			var
				scrollAmount = $(window).scrollTop(),
				postsView = new mfTumblr.PostsView(),
				fullWindowView = new mfTumblr.FullWindowView({
					model: new mfTumblr.FullWindow({
						scrollAmount: scrollAmount
					})
				}),
				headerView = new mfTumblr.HeaderView({
					model: new mfTumblr.Header()
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

$(function() {
	new mfTumblr.AppView();
});