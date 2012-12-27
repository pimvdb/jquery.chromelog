$(function() {
  $.extend($.fn.log.defaults, {
    inline: true,
    group: false
  });

  $("body > *").log();
});
