var MF = MF || {};

// *****************
//  MODELS
// *****************
	MF.Header = Backbone.Model.extend({
		defaults: {
			showFullHeader: true
		}
	});

	MF.FullWindow = Backbone.Model.extend({
		defaults: {
			scrollAmount: 0,
			windowHeight: 0,
			windowWidth: 0
		}
	});

// *****************
//  VIEWS
// *****************
	MF.HeaderView = Backbone.View.extend({
		el: $('#header'),

		initialize: function() {
			_.bindAll(this, 'render');

			//this.listenTo(this.model, 'change', this.updateUi);

			this.render();
		},

		render: function() {
			var $navbar = this.$el.find('#navbar');

			// Hack to make transition to short header more smooth on mobile Safari, since DOM changes only happens after scrolling.
			// Duplicate short header.
			$navbar.clone().attr('id', 'navbar2').addClass('navbar-fixed-top').insertAfter(this.$el);

			// Make main header always on top
			this.$el.css({
				'z-index': '1031',
				'position': 'relative'
			});

			//this.updateUi();

			return this;
		}

		// ,
		// updateUi: function() {
		// 	this.$el.find('#navbar').toggleClass('navbar-fixed-top', !this.model.get('showFullHeader'));	
		// }
	});

	MF.FullWindowView = Backbone.View.extend({
		el: $(window),

		initialize: function() {
			_.bindAll(this, 'detect_scroll', 'detect_resize');

			// debounce function that happens with scroll event
			this.$el.scroll(_.debounce(this.detect_scroll, 80));

			this.$el.resize(_.debounce(this.detect_resize, 100));
		},

		detect_scroll: function() {
			this.model.set({
				scrollAmount: this.$el.scrollTop()
			});
		},

		detect_resize: function() {
			this.model.set({
				windowWidth: this.$el.width(),
				windowHeight: this.$el.height()
			});
		}
	});

	MF.MintyflossPostsView = MF.PostsView.extend({
		initialize: function() {
			_.bindAll(this, 'render', 'resizeImages');

			MF.PostsView.prototype.initialize.call(this, MF.MintyflossPostView);
		},

		resizeImages: function() {
			_(this.postViews).each(function(postView){
			 	postView.resizeImage();
			});
		}
	});

	MF.MintyflossPostView = MF.PostView.extend({
		initialize: function() {
			_.bindAll(this, 'render', 'resizeImage');

			this.timeoutId = '';

			this.render();

			MF.PostView.prototype.initialize.call(this);
		},

		render: function() {
			this.resizeImage();

			return this;
		},

		resizeImage: function() {
			var
				scaleRatio = .75,
				$img = this.$el.find('.photo img'),
				windowHeight = $(window).height(),
				windowWidth = $(window).width(),
				maxHeight = windowHeight * scaleRatio,
				maxWidth = windowWidth * scaleRatio
			;

			// Set max height and max width on image
			$img.css('max-height', maxHeight).css('max-width', maxWidth);

			var adjustCaptionWidth = function($caption, $img, maxWidth) {
				return function() {
					// Set caption width so that it's not wider than the photo
					if ($caption.width() > $img.width() || maxWidth) {
						$caption.width($img.width() || maxWidth);
					}
				}
			}

			if (this.timeoutId) {
				clearTimeout(this.timeoutId);
			}

			// Wait for a bit for image to load before setting caption width
			this.timeoutId = setTimeout(adjustCaptionWidth(this.$el.find('.photo .caption'), $img, maxWidth), 600);
		}
	});

	MF.MintyflossAppView = MF.AppView.extend({
		initialize: function() {
			var
				scrollAmount = $(window).scrollTop(),
				fullWindowView = new MF.FullWindowView({
					model: new MF.FullWindow({
						scrollAmount: scrollAmount
					})
				}),
				headerView = new MF.HeaderView({
					model: new MF.Header()
				}),
				postsView = new MF.MintyflossPostsView()
			;

			// Set showFullHeader property according to the scrollAmount
			headerView.model.set({
				showFullHeader: scrollAmount < headerView.$el.find('h1').height()
			});

			// Detects scrollAmount change
			fullWindowView.model.on('change:scrollAmount', function(model, scrollAmount) {
				var showFullHeader = scrollAmount < headerView.$el.find('h1').height();

				headerView.model.set({
					showFullHeader: showFullHeader
				});

				$('body').toggleClass('hasScrolled', !showFullHeader);
			});

			// Detects windowWidth and windowHeight change
			fullWindowView.model.on({
				'change:windowWidth': postsView.resizeImages,
				'change:windowHeight': postsView.resizeImages
			});

			// Scrolls page to top when clicked
			$('#toTop').click(function() {
				$('html:not(:animated), body:not(:animated)').animate({ scrollTop: 0 }, 'slow');
			});

			MF.AppView.prototype.initialize.call(this);
		}
	});	

$(function() {
	new MF.MintyflossAppView();
});