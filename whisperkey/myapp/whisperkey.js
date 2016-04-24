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
