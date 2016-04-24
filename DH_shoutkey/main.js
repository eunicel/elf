$(function(){

  /**
   * Redirect:
   * window.location.replace("http://stackoverflow.com");
   * "Click a link"
   * window.location.href = "http://stackoverflow.com";
   */

  /**
   * key_name string
   * key = {
   *    long_link,
   *    teacher_id,
   *    secret,
   * }
   */

  var keys = {};

  $.extend({
      getUrlVars : function() {
          var vars = [], hash;
          var hashes = window.location.href.slice(
                  window.location.href.indexOf('?') + 1).split('&');
          for ( var i = 0; i < hashes.length; i++) {
              hash = hashes[i].split('=');
              vars.push(hash[0]);
              vars[hash[0]] = hash[1];
          }
          return vars;
      },
      getUrlVar : function(name) {
          return $.getUrlVars()[name];
      }
  });

  var createNewWhisperKey = function() {
    return 1000;
  }

  $("#newWhisperKey").click(function() {
    var newKey = createNewWhisperKey();
    var current = window.location.href;
    var longLink = document.getElementById("long_link").value;
    var teacherId = document.getElementById("teacher_id").value;
    console.log(current);
    console.log($.getUrlVar('whisperkey'));
    keys[newKey] = {
      "long_link": longLink,
      "teacher_id": teacherId,
      "secret": undefined,
    }
    console.log(keys);
    window.location.href = current+ "?whisperkey="+newKey;
  });


  $("#visitWhisperKey").click(function() {
    var inputKey = document.getElementById("input_key").value;
    var current = window.location.href;
    window.location.replace(current + "?whisperkey=" + inputKey);
  });


  $("#visitLongLink") .click(function() {
    console.log(keys);
    console.log("asdf");
    var input_secret = document.getElementById("input_secret").value;
    var whisperkey = $.getUrlVar('whisperkey')
    if (keys[whisperkey] == undefined) {
      $("#message").html("This whisperkey has expired");
      return
    }

    var secret = keys[whisperkey]["secret"];
    if (secret != undefined) {
      if (secret !== input_secret) {
        $("#message").html("Sorry, wrong secret");
        return
      }
    } else {
      keys[whisperkey]["secret"] = secret;
    }

    var long_link = keys[whisperkey]["long_link"];
    $("#message").html("Link: " + long_link);
    return
  });




  if ($.getUrlVar('whisperkey') !== undefined) {
    console.log("on a whisperkey!!");
    $("#main").hide();
    $("#student").show();
  } else {
    console.log("main page");
  }






});
