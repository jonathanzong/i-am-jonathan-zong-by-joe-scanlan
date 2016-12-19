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

  // $(".drew .studio-img").one("mousemove", function(event) {

  // });

  var commits = [];
  var done = false;

  function cb(json, who) {
    $.each(json, function() {
      var img = "https://github.com/jonathanzong/i-am-jonathan-zong-by-joe-scanlan/raw/"+this.sha+"/studio.jpg";
      commits.push({
        img: img,
        date: this.commit.committer.date.split(/[TZ]/).join(' ').trim(),
        name: who
      });
    });

    if (done) {
      commits.sort(function(a, b) {
          var c = a.date.localeCompare(b.date);
          if (c == 0) {
            return a.name.localeCompare(b.name);
          }
          return -c;
      });

      $.each(commits, function(i) {
        var $li = $("<li>");
        var $a = $("<a>");
        $('.subnav').append($li);
        
        if (this.name.indexOf("Jonathan") >= 0) {
          if ($('.jonathan .timestamp').text().trim().length < 1)
            $('.jonathan .timestamp').text("Last revision: "+this.date);
          
          if (i === commits.length-1) {
            var prefix = " * ┘  ";
          }
          else {
            var prefix = " * │  ";
          }
          $a.text(prefix + this.name + "  " + this.date);
        }
        else {
          if ($('.drew .timestamp').text().trim().length < 1)
            $('.drew .timestamp').text("Last revision: "+this.date);
          $a.text(" │ *  " + this.name + "   " + this.date);
        }

        $a.attr("data-img", this.img);
        $a.attr("data-name", this.name);
        $a.attr("data-date", this.date);
        $a.attr("href", "#");
        $li.append($a);
      });
    }
    else {
      done = true;
    }
  }

  requestJSON("/repos/jonathanzong/i-am-jonathan-zong-by-joe-scanlan/commits?sha=drew&path=studio.jpg", function(json) {
    cb(json, "Drew Wallace");
  });
  requestJSON("/repos/jonathanzong/i-am-jonathan-zong-by-joe-scanlan/commits?sha=jonathan&path=studio.jpg", function(json) {
    cb(json, "Jonathan Zong");
  });

  $(document).on('click', '.revisions a', function(e) {
    console.log(this);
    if ($(this).attr('data-name').indexOf("Jonathan") >= 0) {
      $('.jonathan .studio-img').attr('src', $(this).attr('data-img'));
      $('.jonathan .timestamp').text("Viewing revision: "+$(this).attr('data-date'));
    } else {
      $('.drew .studio-img').attr('src', $(this).attr('data-img'));
      $('.drew .timestamp').text("Viewing revision: "+$(this).attr('data-date'));
    }
    return false;
  })
});

var foo = atob("ZjI1OGJhMWM2MzY5YzdiZDM3Nzc=");
var bar = atob("OGUzNTIxNzBkYjNlYjYxOGVhNjVkZTkyOTcwYmRiZjYyN2U0MDExOA==");
var cat = atob("JmNsaWVudF9pZD0=");
var dog = atob("JmNsaWVudF9zZWNyZXQ9");

function requestJSON(path, callback) {
  $.ajax({
    url: "https://api.github.com" + path + cat + foo + dog + bar,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
    }
  });
}