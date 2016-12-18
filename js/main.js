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
  $(".jonathan .studio-img").one("load", function() {
    resetRight();
  }).each(function() {
    if(this.complete) $(this).load();
  });

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
          return -a.date.localeCompare(b.date);
      });
      $.each(commits, function() {
        var $li = $("<li>");
        var $a = $("<a>");
        $a.text(this.name + " " + this.date);
        $a.attr("data-img", this.img);
        $a.attr("data-name", this.name);
        $a.attr("href", "#");
        $li.append($a);
        $('.subnav').append($li);
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
    } else {
      $('.drew .studio-img').attr('src', $(this).attr('data-img'));
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