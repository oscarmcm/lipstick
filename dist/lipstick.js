/*
 *  lipstick - v1.0.0
 *  A simple off-canvas navigation menu.
 *
 *
 *  Made by Oscar Cortez
 *  Under MIT License
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;
(function($) {

  "use strict";

  // Private attributes and method
  var getPadding = function($el, side) {
    var padding = $el.css("padding-" + side);
    return padding ? +padding.substring(0, padding.length - 2) :
      0;
  };

  var sidePosition = function($el) {
    var paddingLeft = getPadding($el, "left");
    var paddingRight = getPadding($el, "right");
    return ($el.width() + paddingLeft + paddingRight) + "px";
  };

  // Define default setting
  var Lipstick = function($el, options) {
    var setting = {
      width: 340,
      push: true,
      position: "left", // left, right or data
      speed: 300, //ms
      trigger: undefined,
      autoEscape: true,
      top: 0,
      overlay: false,
      "zIndex": 1050,
      overlayColor: 'rgba(0,0,0,0.5)',
      menuColor: "",
      show: function() {}, // Before open
      shown: function() {}, //After opened
      hidden: function() {}, //After closed
      hide: function() {}, //Before close
    };

    // Attributes
    this.setting = $.extend(setting, options);
    this.element = $el;

    this.init();
  };
  // Public methods
  $.extend(Lipstick.prototype, {
    init: function() {

      var self = this,
        trigger = undefined,
        setting = this.setting,
        $el = this.element,
        transition = "all ease " + setting.speed + "ms";

      $el.css({
        position: "fixed",
        width: setting.width,
        transition: transition,
        height: "100%",
        top: setting.top,
        'background-color': setting.menuColor
      })
      if (setting.position != "data") {
        $el.css(setting.position, "-" + sidePosition($el));
        $el.css('display', 'initial'); // make menu visible after DOM render
      }

      if (setting.overlay) {
        $el.css('z-index', setting.zIndex);

        // create overlay element
        self.overlayElement = $("<div class='lipstick-overlay'></div>")
          .hide()
          .css({
            position: 'fixed',
            top: 0,
            left: 0,
            height: '100%',
            width: '100%',
            'z-index': setting.zIndex - 1,
            'background-color': setting.overlayColor,
          }).click(function() {
            self.hide(trigger);
          });

        $("body").prepend(self.overlayElement);
      }

      // Add close stage
      $el.data("slide-reveal", false);

      if (setting.push) {
        $("body").css({
          position: "relative",
          "overflow-x": "hidden",
          transition: transition,
          left: "0px"
        });
      }

      // Attach trigger using click event
      if (setting.trigger && setting.trigger.length > 0) {

        setting.trigger.on('click.slideReveal', function() {
          trigger = $(this);

          // check if have a data position
          if (trigger.data('position')) {
            if (trigger.data('position') == "left") {
              $el.css({
                "left": "-" + sidePosition($el),
                "display": "initial"
              });
              self.show(trigger);
            } else {
              $el.css({
                left: "",
                right: "-" + sidePosition($el),
                'display': 'initial'
              });
              self.show(trigger)
            }
          } else if (!$el.data("slide-reveal")) { // Show
            self.show();
          } else { // Hide
            self.hide();
          }
        });

      }

      // Bind hide event to ESC
      if (setting.autoEscape) {
        $(document).on('keydown.slideReveal', function(e) {
          if ($('input:focus, textarea:focus').length ===
            0) {
            if (e.keyCode === 27 && $el.data(
                "slide-reveal")) { // ESC
              self.hide(trigger);
            }
          }
        });
      }

    },

    show: function(trigger, triggerEvents) {
      var setting = this.setting;
      var $el = this.element;
      var $overlayElement = this.overlayElement;

      // trigger show() method
      if (triggerEvents === undefined || triggerEvents) {
        setting.show($el);
      }

      // show overlay
      if (setting.overlay) {
        $overlayElement.show();
      }

      // slide the panel
      if (setting.position == "data") {
        $el.css(trigger.data('position'), "0px");
      } else {
        $el.css(setting.position, "0px");
      }

      if (setting.push) {
        if (setting.position == "data") {
          if (trigger.data('position') === "left") {
            $("body").css("left", sidePosition($el));
          } else {
            $("body").css("left", "-" + sidePosition($el));
          }
        } else if (setting.position === "left") {
          $("body").css("left", sidePosition($el));
        } else {
          $("body").css("left", "-" + sidePosition($el));
        }
      }
      $el.data("slide-reveal", true);

      // trigger shown() method
      if (triggerEvents === undefined || triggerEvents) {
        setTimeout(function() {
          setting.shown($el);
        }, setting.speed);
      }

    },

    hide: function(trigger, triggerEvents) {

      var setting = this.setting;
      var $el = this.element;
      var $overlayElement = this.overlayElement;

      // trigger hide() method
      if (triggerEvents === undefined || triggerEvents) {
        setting.hide($el);
      }

      // hide the panel
      if (setting.push) {
        $("body").css("left", "0px");
      }

      if (setting.position == "data") {
        $el.css(trigger.data('position'), "-" + sidePosition(
          $el));
      } else {
        $el.css(setting.position, "-" + sidePosition($el));
      }

      $el.data("slide-reveal", false);

      // trigger hidden() method
      if (triggerEvents === undefined || triggerEvents) {
        setTimeout(function() {
          // hide overlay
          if (setting.overlay) {
            $overlayElement.hide();
          }

          setting.hidden($el);
        }, setting.speed);
      }
    },

    toggle: function(triggerEvents) {
      var $el = this.element;
      if ($el.data('slide-reveal')) {
        this.hide(triggerEvents);
      } else {
        this.show(triggerEvents);
      }
    },

    remove: function() {
      this.element.removeData('slide-reveal-model');
      if (this.setting.trigger && this.setting.trigger.length >
        0) {
        this.setting.trigger.off('.slideReveal');
      }
      if (this.overlayElement && this.overlayElement.length >
        0) {
        this.overlayElement.remove();
      }
    }

  });

  // jQuery collection methods
  $.fn.lipstick = function(options, triggerEvents) {

    if (options !== undefined && typeof(options) === "string") {
      this.each(function() {
        var slideReveal = $(this).data('slide-reveal-model');

        if (options === "show") {
          slideReveal.show(triggerEvents);
        } else if (options === "hide") {
          slideReveal.hide(triggerEvents);
        } else if (options === 'toggle') {
          slideReveal.toggle(triggerEvents);
        }
      });
    } else {
      this.each(function() {
        if ($(this).data('slide-reveal-model')) {
          $(this).data('slide-reveal-model').remove();
        }
        $(this).data('slide-reveal-model', new Lipstick($(
          this), options));
      });
    }

    return this;

  };

}(jQuery));
