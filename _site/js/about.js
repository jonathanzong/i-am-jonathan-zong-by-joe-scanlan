$(document).ready(function() {
  $(".studio-img").panzoom({
    contain: "invert",
    disableZoom: true,
    disableYAxis: true
  });

  function resetRight() {
    $(".drew .studio-img").panzoom("pan", -$(".jonathan .studio-img").width(), 0, {silent: true, relative: true});
  }
  resetRight();
  $(window).resize(resetRight);
  $(".drew .studio-img").one("load", function() {
    resetRight();
  }).each(function() {
    if(this.complete) $(this).load();
  });
});
