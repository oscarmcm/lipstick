(function($) {

	"use strict";

	// Private attributes and method
	var getPadding = function($el, side) {
		var padding = $el.css("padding-" + side);
		return padding ? +padding.substring(0, padding.length - 2) : 0;
	};

	var sidePosition = function($el) {
		var paddingLeft = getPadding($el, "left");
		var paddingRight = getPadding($el, "right");
		return ($el.width() + paddingLeft + paddingRight) + "px";
	};

	// Define default setting
	var Lipstick = function($el, options) {
		var setting = {
			trigger: "", // jQuery DOM object
			container: "", // jQuery DOM object
			type: "", // push, overlay, reveal
			position: "left", // left, right or data
			menuWidth: 340, //small, medium, large, px
			speed: 1000, // ms
			autoEscape: true, // Use ESC
			top: 0,
			"zIndex": 1049,
			useOverlay: false,
			overlayColor: "rgba(0,0,0,0.5)",
			menuColor: "",
			show: function() {}, // Before open
			shown: function() {}, //After opened
			hide: function() {}, //Before close
			hidden: function() {} //After closed
		};

		// Attributes
		this.setting = $.extend(setting, options);
		this.element = $el;

		this.init();
	};

	$.extend(Lipstick.prototype, {
		init: function() {

			var self = this,
				setting = this.setting,
				$el = this.element,
				transition = "all ease " + setting.speed + "ms",
				defaultDimensions = {
					'small': '33%',
					'medium': '66%',
					'large': '100%'
				};

			$el.css({
				position: "fixed",
				width: defaultDimensions[setting.menuWidth] ? defaultDimensions[setting.menuWidth] : setting.menuWidth,
				transition: transition,
				height: "100%",
				top: setting.top,
				"background-color": setting.menuColor
			});

			// Add close stage
			$el.data("slide-reveal", false);

			if (setting.position !== "data") {
				$el.css(setting.position, "-" + sidePosition($el));
				$el.css("display", "initial"); // make menu visible after DOM render
			}

			// create overlay element
			if (setting.useOverlay) {
				$el.css("z-index", setting.zIndex);
				self.overlayElement = $("<div class='lipstick-overlay'></div>")
					.hide()
					.css({
						position: "fixed",
						top: 0,
						left: 0,
						height: "100%",
						width: "100%",
            transition: transition,
						"z-index": setting.zIndex - 1,
						"background-color": setting.overlayColor
					}).click(function() {
						self.hide(self.trigger);
					});
				$("body").prepend(self.overlayElement);
			}

			// Add animation to Body
			if (setting.type !== "overlay") {
				setting.container.css({
					position: "relative",
					"overflow-x": "hidden",
					transition: transition,
					left: "0px"
				});
			}

			if (setting.type === "reveal") {
				setting.container.css("z-index", setting.zIndex);
			}

			// Bind hide event to ESC
			if (setting.autoEscape) {
				$(document).on("keydown.slideReveal", function(e) {
					if ($("input:focus, textarea:focus").length === 0) {
						if (e.keyCode === 27 && $el.data("slide-reveal")) { // ESC
							self.hide(self.trigger);
						}
					}
				});
			}

			// Attach trigger using click event
			if (setting.trigger && setting.trigger.length > 0) {
				setting.trigger.on("click.slideReveal", function() {
					self.trigger = $(this);
					var position = self.trigger.data("position");

					// check if have a data position
					if (setting.position === "data" && position) {
						if (setting.type !== "reveal") {
							if (position === "left") {
								$el.css({
									"left": "-" + sidePosition($el),
									"display": "initial"
								});
							} else {
								$el.css({
									left: "",
									right: "-" + sidePosition($el),
									"display": "initial"
								});
							}
							self.show(self.trigger);
						} else { // Is Reveal Type
							$el.css("z-index", setting.zIndex - 1);
							if (position === "left") {
								$el.css({
									"left": 0,
									"display": "initial"
								});
							} else {
								$el.css({
									"right": 0,
									"display": "initial"
								});
							}
							self.show(self.trigger);
						}
					} else if (!$el.data("slide-reveal")) {
						self.show(); // Show
					} else {
						self.hide(); // Hide
					}
				});
			}

		},

		show: function(trg, triggerEvents) {
			var setting = this.setting;
			var $el = this.element;
			var $overlayElement = this.overlayElement;

			// trigger show() method
			if (triggerEvents === undefined || triggerEvents) {
				setting.show($el);
			}

			// show overlay
			if (setting.useOverlay) {
				$overlayElement.show();
			}

			// Animate menu
			if (setting.type !== "reveal") {
				setting.position === "data" ? $el.css(trg.data("position"), "0px") : $el.css(setting.position, "0px")
			}

			// Animate body
			var position = setting.position === "data" ? trg.data("position") : setting.position
			position === "left" ? setting.container.css("left", sidePosition($el)) : setting.container.css("left", "-" + sidePosition($el))

			// add open stage
			$el.data("slide-reveal", true);

			// trigger shown() method
			if (triggerEvents === undefined || triggerEvents) {
				setTimeout(function() {
					setting.shown($el);
				}, setting.speed);
			}

		},

		hide: function(trg, triggerEvents) {
			var setting = this.setting;
			var $el = this.element;
			var $overlayElement = this.overlayElement;

			// trigger hide() method
			if (triggerEvents === undefined || triggerEvents) {
				setting.hide($el);
			}

			// hide the panel
			if (setting.type !== "overlay") {
				setting.container.css("left", "0px");
			}

			if (setting.position === "data" && setting.type !== "reveal") {
				$el.css(trg.data("position"), "-" + sidePosition($el));
			} else {
				$el.css(setting.position, "-" + sidePosition($el));
			}

			$el.data("slide-reveal", false);

			// trigger hidden() method
			if (triggerEvents === undefined || triggerEvents) {
				setTimeout(function() {
					// hide overlay
					if (setting.useOverlay) {
						$overlayElement.hide();
					}
					setting.hidden($el);
				}, setting.speed);
			}
		},

		toggle: function(triggerEvents) {
			var $el = this.element;
			if ($el.data("slide-reveal")) {
				this.hide(triggerEvents);
			} else {
				this.show(triggerEvents);
			}
		},

		remove: function() {
			this.element.removeData("slide-reveal-model");
			if (this.setting.trigger && this.setting.trigger.length > 0) {
				this.setting.trigger.off(".slideReveal");
			}
			if (this.overlayElement && this.overlayElement.length > 0) {
				this.overlayElement.remove();
			}
		}

	});

	// jQuery collection methods
	$.fn.lipstick = function(options, triggerEvents) {

		if (options !== undefined && typeof(options) === "string") {
			this.each(function() {
				var slideReveal = $(this).data("slide-reveal-model");
				if (options === "show") {
					slideReveal.show(triggerEvents);
				} else if (options === "hide") {
					slideReveal.hide(triggerEvents);
				} else if (options === "toggle") {
					slideReveal.toggle(triggerEvents);
				}
			});
		} else {
			this.each(function() {
				if ($(this).data("slide-reveal-model")) {
					$(this).data("slide-reveal-model").remove();
				}
				$(this).data("slide-reveal-model", new Lipstick($(this), options));
			});
		}

		return this;

	};

}(jQuery));
