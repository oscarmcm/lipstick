// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

;( function($) {

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


})(jQuery);
