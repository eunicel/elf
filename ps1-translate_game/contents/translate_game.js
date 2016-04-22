// This allows the Javascript code inside this block to only run when the page
// has finished loading in the browser.
$(function() {
	var lang_to		= "English";
	var lang_from		= "Spanish";
	var current_dict	= dicts[lang_to][lang_from]; // keys: words in @lang_to, values: corresponding words in @lang_from

  var delete_examples = true
  var promptWord;

  $('.from').html(lang_from);
  $('.to').html(lang_to);

  /**
   * Randomly chooses a new word for the user to translate.
   */
  var createNewPrompt = function() {
    document.getElementById("userInput").value = "";
    $("#userInput").focus();
    var table = document.getElementById("table");
    var pickRandomWord = function() {
      var keys = Object.keys(current_dict)
      return current_dict[keys[Math.floor(keys.length * Math.random())]];
    }

    newWord = document.getElementById("promptWord");
    if (newWord !== undefined) {
       promptWord = pickRandomWord();
       newWord.innerHTML = promptWord;
       newWord.style.color = "black";
    }
  }

  // Create a new promptWord immediately
  createNewPrompt();

  /**
   * Gets the translation of the promptWord.
   */
  var getTranslation = function() {
    var translation = Object.keys(current_dict).filter(function(key) {
        return current_dict[key] === promptWord;
      });

    if (translation.length >= 1) {
      return translation[0];
    } else {
      return ""
    }
  }

  // Check the user's input if the "See Answer" button is clicked.
  $("#seeAnswer").on("click", function(event) {
    event.preventDefault();
    seeAnswer();
  });

  // Check the user's input if they press enter.
  $("#userInput").keydown(function(event) {
    var key = event.keyCode || event.which;
    if (key === 13) {
      seeAnswer();
      $("#userInput").autocomplete("close");
    }
  });


  /**
   * Checks the user's answer if they entered a guess, either by typing or clicking
   * an autocomplete suggestion. Inserts into the history using the appropriate format
   * and creates a new prompt.
   */
  var seeAnswer = function(autocompleted) {
    input = autocompleted === undefined ? $("#userInput").val() : autocompleted;

    if (input === "") {
      return;
    }

    var row = table.insertRow(2);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    cell2.className = "guess";
    var cell3 = row.insertCell(2);

    cell1.innerHTML=promptWord;
    cell2.innerHTML=input;
    if (promptWord !== undefined) {
      if (promptWord === current_dict[input]) {
        $(row).addClass("correct");
        cell3.innerHTML='<span class="ui-icon ui-icon-check"></span>';
      } else {
        $(row).addClass("incorrect");
        var translation = getTranslation();
        cell3.innerHTML = translation;
      }
    }

    if (delete_examples) {
      $(".example").remove();
    }

    createNewPrompt();
  };

  $("#userInput").autocomplete({
    minLength: 2,
    source: Object.keys(current_dict),
    select: function(e, ui) {
      if (e.keyCode !== 13) {
        seeAnswer(ui.item.value)
      } 
      $(this).val('');
      $(this).focus();
      return false;
    },
  }).data("ui-autocomplete")._renderItem = function (ul, item) {
      var highlighted = item.value.replace(this.term,
              "<span class='ui-state-highlight'>" + this.term + "</span>");

      return $("<li></li>")
          .data("item.autocomplete", item)
          .append("<a>" + highlighted  + "</a>")
          .appendTo(ul);
    };
});
