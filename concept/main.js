$(function() {
  var dictionary = ["apple", "bird", "cat", "dog", "eagle"]

  var twokey = false;
  var password = false;

  var attempts = 0;
  var limited = false;
  var delay = false;
  var redirects = {};

  var init = function() {
    var current = window.location.href;
    var start = current.lastIndexOf("/");
    var end = current.lastIndexOf(".");
    var page = current.substring(start+1, end);

    if (page === "shoutkey") {
      redirects = {"cat" : "./secret.html"};
    } else if (page === "twokey") {
      twokey = true;
      redirects = {"birddog" : "./secret.html"};
    } else if (page === "password" || page === "limited" || page === "delay") {
      limited = page === "limited";
      delay = page === "delay";
      redirects = {"apple" : {"password": dog, "redirect": "./secret.html"}};
    } else {
      console.log("page " + page);
    }

    displayDict();
  }

  var displayDict = function() {
    dictionary.forEach(function(item) {
      $("#dict").append("<div class='item'>"+item+"</div>");
    });
  }

  var checkAttempt = function() {
    var input = document.getElementById("key").value;
    if (twokey) {
      input += document.getElementById("key2").value;
    }

    var redirect = redirects[input];
    if (redirect !== undefined) {
      window.location.replace(redirect);
    } else {
      $("#sorry").show();
    }
  }

  $('input').keydown(function(e) {
    if (e.keyCode == 13) {
      checkAttempt();
    }
  });

  $("#attempt").click(function() {
    checkAttempt();
  });

  $(document).on("click", "#input_key", function(){
    $("#sorry").hide();
  });


  init();





});
