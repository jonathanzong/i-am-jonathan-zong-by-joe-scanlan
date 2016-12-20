$(document).ready(function() {
  $(".studio-img").panzoom({
    contain: "invert",
    disableZoom: true,
    disableYAxis: true
  });

  // TODO maintain relative pan on resize events
  // Q: should these reset on image load?
  function resetPan() {
    var leftOffscreen = ( $(".jonathan .studio-img").width() - 2*$(".jonathan .img-contain").width() ) / 2;
    $(".jonathan .studio-img").panzoom("pan", -leftOffscreen, 0, {silent: true, relative: false});
    $(".drew .studio-img").panzoom("pan", -$(".jonathan .img-contain").width() - leftOffscreen, 0, {silent: true, relative: false});
  }
  resetPan();
  $(window).resize(resetPan);

  $(".drew .studio-img").one("load", function() {
    resetPan();
  }).each(function() {
    if(this.complete) $(this).load();
  });
  $(".jonathan .studio-img").one("load", function() {
    resetPan();
  }).each(function() {
    if(this.complete) $(this).load();
  });

  // month: int [0, 11]
  function getMonthString(month) {
    if (month === 0)  return "Jan";
    if (month === 1)  return "Feb";
    if (month === 2)  return "Mar";
    if (month === 3)  return "Apr";
    if (month === 4)  return "May";
    if (month === 5)  return "Jun";
    if (month === 6)  return "Jul";
    if (month === 7)  return "Aug";
    if (month === 8)  return "Sep";
    if (month === 9)  return "Oct";
    if (month === 10) return "Nov";
    if (month === 11) return "Dec";
    return "";
  }

  function pad(num, width, chr) {
    num = num + '';
    width = width || 2;
    chr = chr || " ";
    return num.length >= width ? num : new Array(width - num.length + 1).join(chr) + num;
  }

  var commits = [];
  var done = false;

  function cb(json, who) {
    $.each(json, function() {
      var img = "https://github.com/jonathanzong/i-am-jonathan-zong-by-joe-scanlan/raw/"+this.sha+"/studio.jpg";

      var date = new Date(this.commit.committer.date);
      var dateStr = getMonthString(date.getMonth()) + " " + pad(date.getDate(), 2) + " "  + date.getFullYear()
                    + "  " + pad(date.getHours(), 2, "0") + ":" + pad(date.getMinutes(), 2, "0");

      commits.push({
        img: img,
        date: this.commit.committer.date.split(/[TZ]/).join(' ').trim(),
        dateStr: dateStr,
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

      var isCurJonathan = true;
      var isCurDrew = true;
      $.each(commits, function(i) {
        var $li = $("<li>");
        var $a = $("<a>");
        $('.subnav').append($li);
        
        var isCurrent = false;

        if (this.name.indexOf("Jonathan") >= 0) {
          isCurrent = isCurJonathan;
          isCurJonathan = false;
          if ($('.jonathan .timestamp').text().trim().length < 1) {
            $('.jonathan .timestamp').text("viewing revision: " + this.dateStr + "  (latest)");
          }
          
          if (i === commits.length-1) {
            var prefix = " * ┘  ";
          }
          else {
            var prefix = " * │  ";
          }
          $a.text(prefix + this.name + "  " + this.dateStr);
        }
        else {
          isCurrent = isCurDrew;
          isCurDrew = false;
          if ($('.drew .timestamp').text().trim().length < 1) {
            $('.drew .timestamp').text("viewing revision: " + this.dateStr + "  (latest)");
          }
          $a.text(" │ *  " + this.name + "   " + this.dateStr);
        }

        if (isCurrent) {
          $a.addClass("selected-revision");
        }

        $a.attr("data-isCurrent", isCurrent);
        $a.attr("data-img", this.img);
        $a.attr("data-name", this.name);
        $a.attr("data-date", this.date);
        $a.attr("data-dateStr", this.dateStr);
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
    var thisName = $(this).attr('data-name');

    $(".revisions a").each(function(idx, elt) {
      var sel = $(elt);
      if (sel.attr("data-name") === thisName) {
        sel.removeClass("selected-revision");
      }
    });
      
    $(this).addClass("selected-revision");
    var prefix = "viewing revision: ";
    var postfix = $(this).attr('data-isCurrent')==="true" ? " (latest)" : "";
    if (thisName.indexOf("Jonathan") >= 0) {
      $('.jonathan .studio-img').attr('src', $(this).attr('data-img'));
      $('.jonathan .timestamp').text(prefix + $(this).attr('data-dateStr') + postfix);
    } else {
      $('.drew .studio-img').attr('src', $(this).attr('data-img'));
      $('.drew .timestamp').text(prefix + $(this).attr('data-dateStr') + postfix);
    }
    return false;
  });

  $('.nav-revisions').click(function(e) {
    e.preventDefault();
    if (!$(this).hasClass('active')) {
      $(this).addClass('active');
      $(document).one('click', function closeMenu (e){
          if($('.nav-revisions').has(e.target).length === 0){
              $('.nav-revisions').removeClass('active');
          } else {
              $(document).one('click', closeMenu);
          }
      });
    } else {
      $(this).removeClass('active');
    }
  });
});

var foo = atob("JmFjY2Vzc190b2tlbj0wYTNjNDJmODY2MjM1OWRhOWI3M2M3Y2U3OTI5NDNmYmIwNDI5NWNh");

function requestJSON(path, callback) {
  $.ajax({
    url: "https://api.github.com" + path + foo,
    complete: function(xhr) {
      callback.call(null, xhr.responseJSON);
    }
  });
}