$(function() {
  var dictionary = ["apple", "bird", "cat", "dog", "eagle"]
  var redirects = {
    "cat" : "./secret.html",
  }

  var init = function() {
    dictionary.forEach(function(item) {
      $("#dict").append("<div class='item'>"+item+"</div>");
    });

  }

  $("#attempt").click(function() {
    var input = document.getElementById("key").value;
    var redirect = redirects[input];
    if (redirect !== undefined) {
      window.location.replace(redirect);
    }
    $("#sorry").show();
  });

  $(document).on("click", "#input_key", function(){
    $("#sorry").hide();
  });


  init();





});
