$(function() {
  var dictionary = ["apple", "bird", "cat", "dog", "eagle"]

  var twokey = false;
  var password = false;

  var attempts = 0;
  var limited = false;
  var exponential = false;
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
    } else if (page === "password" || page === "limited" || page === "exponential") {
      limited = page === "limited";
      exponential = page === "exponential";
      redirects = {"apple" : {"password": dog, "redirect": "./secret.html"}};
    } else {
      console.log("unknown page " + page);
    }

    displayDict();
  }

  var displayDict = function() {
    dictionary.forEach(function(item) {
      $("#dict").append("<div class='item'>"+item+"</div>");
    });
  }

  $("#attempt").click(function() {
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
  });

  $(document).on("click", "#input_key", function(){
    $("#sorry").hide();
  });


  init();





});
