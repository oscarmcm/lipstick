(function($) {
  /*
    ======== A Handy Little QUnit Reference ========
    http://api.qunitjs.com/
    Test methods:
      module(name, {[setup][ ,teardown]})
      test(name, callback)
      expect(numberOfAssertions)
      stop(increment)
      start(decrement)
    Test assertions:
      ok(value, [message])
      equal(actual, expected, [message])
      notEqual(actual, expected, [message])
      deepEqual(actual, expected, [message])
      notDeepEqual(actual, expected, [message])
      strictEqual(actual, expected, [message])
      notStrictEqual(actual, expected, [message])
      throws(block, [expected], [message])
  */

  module('jQuery#lipstick', {
    // This will run before each test in this module.
    setup: function() {
      this.elems = $('#qunit-fixture');
    }
  });

  test('is chainable', function() {
    strictEqual(this.elems.lipstick(), this.elems, 'should be chainable');
  });

  test('attachs model to data attribute', function() {
    var lipstick = this.elems.lipstick().data('slide-reveal-model');
    strictEqual(lipstick.element.prop("id"), this.elems.prop("id"));
  });

  test('all settings are overridden correctly', function() {
    var setting = {
      width: 300,
      push: false,
      position: "right",
      speed: 400, //ms
      trigger: $('<div id="dummy">'),
      autoEscape: false,
      show: function() {
        return true;
      },
      shown: function() {
        return true;
      },
      hidden: function() {
        return true;
      },
      hide: function() {
        return true;
      },
      top: 20,
      overlay: true,
      "zIndex": 2000,
      overlayColor: 'rgba(255,0,0,0.5)'
    };
    var lipstick = this.elems.lipstick(setting).data('slide-reveal-model');
    strictEqual(lipstick.setting.width, setting.width);
    strictEqual(lipstick.setting.push, setting.push);
    strictEqual(lipstick.setting.position, setting.position);
    strictEqual(lipstick.setting.speed, setting.speed);
    strictEqual(lipstick.setting.trigger.prop('id'), 'dummy');
    strictEqual(lipstick.setting.autoEscape, setting.autoEscape);
    strictEqual(lipstick.setting.show(), true);
    strictEqual(lipstick.setting.shown(), true);
    strictEqual(lipstick.setting.hidden(), true);
    strictEqual(lipstick.setting.hide(), true);
    strictEqual(lipstick.setting.top, setting.top);
    strictEqual(lipstick.setting.overlay, setting.overlay);
    strictEqual(lipstick.setting.zIndex, setting.zIndex);
    strictEqual(lipstick.setting.overlayColor, setting.overlayColor);
  });

  test('attach overlayElement to model when overlay is set to true', function() {
    var lipstick = this.elems.lipstick({
      overlay: true
    }).data('slide-reveal-model');

    strictEqual(lipstick.overlayElement.hasClass('slide-reveal-overlay'), true);
  });

  test('nothing attached overlayElement to model when overlay is set to false', function() {
    var lipstick = this.elems.lipstick({
      overlay: false
    }).data('slide-reveal-model');

    strictEqual(lipstick.overlayElement, undefined);
  });

}(jQuery));
