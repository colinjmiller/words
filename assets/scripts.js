/*
 * Created by Colin Miller for the 18-hour Facebook Hackathon (March 6-7, 2015)
 */

'use strict';

(function($, window, document) {

  var dictionary = [];
  var streak = 0;
  var difficulty = 1;
  var upperBase = 1500;
  var goal = "Loading...";

  var runnerBounds;

  var obstacles = {
    crate: {
      src: "assets/crate.jpg",
      width: "64",
      height: "64",
      speed: 1
    }
  }
  var obstacleTimer;

  $.get('/assets/dictionary.txt', function(data) {
    parseDictionary(data);
    attachHandlers();
    $("#answer").focus();
  }, 'text'); 

  function parseDictionary(data) {
    data = data.trim();
    var wordArray = data.split("\n");
    $.each(wordArray, function(index, value) {
      var wordLength = value.length.toString();
      if (dictionary[wordLength] === undefined) {
        dictionary[wordLength] = [value];
      } else {
        dictionary[wordLength].push(value);
      }
    });
    pickWord();
    obstacleTimer = setInterval(moveObstacles, 15);
    runnerBounds = {x: $("#runner").offset().left, y: $("#runner").offset().top, width: $("#runner").width(), height: $("#runner").height()};
  }

  function pickWord() {
    var wordLength = Math.min(21, Math.floor(Math.random() * (difficulty) + 3));
    var bucket = dictionary[wordLength.toString()];
    goal = bucket[Math.floor(Math.random() * bucket.length)];
    $("#goal").text(goal);
    $("#answer").attr("placeholder", goal);
    placeObstacle();
  }

  function placeObstacle() {
    $("<img/>", {
      class: "obstacle",
      src: "assets/crate.jpg",
      alt: "Crate",
      speed: 1,
      status: "active"
    }).appendTo("#play-area");
  }

  function moveObstacles() {
    $(".obstacle").each(function() {
      var obj = $(this);
      obj.css({left: obj.position().left - obj.attr("speed") });
      var boundingBox = {x: obj.offset().left, y: obj.offset().top, width: obj.width(), height: obj.height()};

      if (obj.attr("status") === "active" && isCollide(boundingBox, runnerBounds)) {
        obj.remove();
        killRunner();
      }
    });
  }

  function isCollide(a, b) {
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
  }

  function killRunner() {
    $("#runner").addClass("over");
  }

  function attachHandlers() {
    $("#answer").keyup(function(evt) {
      var field = $(this);
      var prev = difficulty;
      if (field.val() === goal) {
        $("#streak").text(++streak);
        field.val("");
        pickWord();
        upperBase *= 1.5;
        difficulty = (difficulty > 21) ? 21 : baseLog(10, upperBase);
      }
    });
  }

  function baseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

}(window.jQuery, window, document));