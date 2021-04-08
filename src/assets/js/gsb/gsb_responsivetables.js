/*!
 * GSB-Plugin zum wrappen von Tabellen fuer die mobile Darstellung
 *
 * Author: sbaecker
 */

;(function($) {
 if (!$.gsb) {
  $.gsb = {};
 }
 $.gsb.responsiveTables = function(el, options) {
  // To avoid scope issues, use 'base' instead of 'this'
  // to reference this class from internal events and functions.
  var base = this;
  // Access to $ and DOM versions of element
  base.$el = $(el);
  base.el = el;
  // Add a reverse reference to the DOM object
  base.$el.data("gsb.responsiveTables", base);
  base.init = function() {
   base.options = $.extend({}, $.gsb.responsiveTables.defaultOptions, options);

   //Initialization Code
   if(base.$el.find('table').length > 0){
    base.$el.find('table').each(function(){
     switch(base.options.way){
      case 'scroll':
       $(this).wrap('<div class="responsiveTable"></div>');
       break;
      default:
       $(this).wrap('<div class="responsiveTable"></div>');
       break;
     }
    });

   }
  };

  // Run initializer
  base.init();
 };
 $.gsb.responsiveTables.defaultOptions = {
  way: 'scroll'
 };

 $.fn.gsb_responsiveTables = function(options) {
  return this.each(function() {(new $.gsb.responsiveTables(this, options));
  });
 };
})(jQuery);