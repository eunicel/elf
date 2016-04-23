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
      redirects = {"catdog" : "./secret.html"};
    } else if (page === "password" || page === "limited" || page === "delay") {
      password = page === "password";
      limited = page === "limited";
      delay = page === "delay";
      redirects = {"birddog" : "./secret.html"};
      //redirects = {"apple" : {"password": "dog", "redirect": "./secret.html"}};
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
    if (password) {
      $("#password_prompt").show();
      return
    }

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

  var checkPassword = function() {
    var input = document.getElementById("key").value + document.getElementById("password").value;

    $("#password_prompt").hide();

    var redirect = redirects[input];
    if (redirect !== undefined) {
      window.location.replace(redirect);
    } else {
      $("#sorry").show();
    }
  }

  $('input').keydown(function(e) {
    if (e.keyCode == 13) {
      if (this.id=="password") {
        checkPassword();
      } else {
        checkAttempt();
      }
    }
  });

  $("#attempt").click(function() {
    checkAttempt();
  });


  $("#attempt_password").click(function() {
    checkPassword();
  });



  $(document).on("click", "#input_key", function(){
    $("#sorry").hide();
  });


  init();





});
