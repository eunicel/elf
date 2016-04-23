// global variables

// creates the angular application
var app = angular.module('whisperKeyApp', []);

// creates the angular directive
// notice that the directive name is whisperKey, but in HTML you will reference the tag as <tic-tac-toe></tic-tac-toe>
app.directive("whisperKey", function() {
  // controller for the directive
  var whisperKeyController = function($window, $scope) {
    // to avoid conflicts with 'this' in callback functions
    var controller = this;

    this.currentGame = null;

    // toggles the player between X and O, depending on what the current player is
    controller.goTo = function(choice) {
      if (choice === "shoutkey") {
        $("#shoutkeyPage").show();
      }

      $("#mainPage").hide();

    }
  };


  return {
    controller: whisperKeyController,
    controllerAs: "controller", // this is how the controller will be referenced in the directive
    scope: true,
    // Using ` allows us to have a string that spans multiple lines!
    //template: `<button ng-click="">Start New Game</button>`
    templateUrl: "./main.html"
  };
});
