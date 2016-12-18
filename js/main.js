$(document).ready(function() {
  $(".studio-img").panzoom({
    contain: "invert",
    disableZoom: true,
    disableYAxis: true
  });

  function resetRight() {
    $(".jonathan .studio-img").panzoom("pan", -$(".jonathan .studio-img").width(), 0, {silent: true, relative: true});
  }
  resetRight();
  $(window).resize(resetRight);
})