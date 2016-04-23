$(function() {
  var dictionary = ["apple", "bird", "cat", "dog", "eagle"]

  var twokey = false;
  var password = false;

  var attempts = {};
  var max_attempts = 3;
  var limited = false;
  var delay = false;
  var redirects = {};

  $('.ui.accordion').accordion();

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
      password = true;
      limited = page === "limited";
      $(".max_attempts").html(max_attempts);
      delay = page === "delay";
      redirects = {"catdog" : "./secret.html"};
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
    var input = document.getElementById("key").value;
    if (password) {
      if (attempts[input] === undefined) {
        attempts[input] = 0;
      }
      $("#password_prompt").show();

      var remaining = max_attempts-attempts[input];
      $("#remaining").html(remaining);
      if (remaining == 0) {
        $("#ok").hide();
        $("#error").show();
        $("#guess_key").html(input);
      }
      return
    }

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
    var input = document.getElementById("key").value
    attempts[input]++;

    input += document.getElementById("password").value;

    $("#password_prompt").hide();

    console.log(attempts[input] + "  " + max_attempts);
    $("#sorry").html("Sorry, incorrect password");

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

  $("#close_password").click(function() {
    $("#password_prompt").hide();
    $("#ok").show();
    $("#error").hide();
    $("#sorry").html("You have reached the maximum number of password attempts for this key");
  });


  $(document).on("click", "#input_key", function(){
    $("#sorry").hide();
  });


  init();





});
