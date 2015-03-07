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

  var obstacles = [
    {
      type: "crate",
      src: "assets/crate.jpg",
      width: "64",
      height: "64",
      speed: 1.2
    },
    {
      type: "stone",
      src: "assets/stone.png",
      width: "128",
      height: "128",
      speed: 1
    },
    {
      type: "tire",
      src: "assets/tire.png",
      width: "96",
      height: "96",
      speed: 1.5
    }
  ];
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
    runnerBounds = {x: $("#runner").position().left, y: $("#runner").position().top, width: $("#runner").width(), height: $("#runner").height()};
  }

  function pickWord() {
    if ($("#runner").hasClass("over")) { return; }
    var wordLength = Math.min(21, Math.floor(Math.random() * (difficulty) + 3));
    var bucket = dictionary[wordLength.toString()];
    goal = bucket[Math.floor(Math.random() * bucket.length)];
    $("#goal").text(goal);
    $("#answer").attr("placeholder", goal);
    placeObstacle();
  }

  function placeObstacle() {
    var obstacle = obstacles[Math.floor(Math.random() * obstacles.length)];
    $("<img/>", {
      class: "obstacle " + obstacle.type,
      src: obstacle.src,
      alt: obstacle.type,
      speed: obstacle.speed,
      status: "active"
    }).css("right", -obstacle.width + "px").appendTo("#play-area");
  }

  function moveObstacles() {
    $(".obstacle").each(function() {
      var obj = $(this);
      obj.css({left: obj.position().left - obj.attr("speed") - (difficulty / 10) });
      var boundingBox = {x: obj.position().left, y: obj.position().top, width: obj.width(), height: obj.height()};

      if (obj.attr("status") === "active" && isCollide(boundingBox, runnerBounds)) {
        killRunner();
      }
    });
  }

  function destroyObstacle() {
    var obj = $(".obstacle").first().attr("status", "inactive");
    var destructionTypes = [destroyByLightning, destroyByBoot, destroyByNyan];
    destructionTypes[Math.floor(Math.random() * destructionTypes.length)](obj);
  }

  function destroyByLightning(obj) {
    $("#storm-cloud").addClass("active");
    setTimeout(function() {
      $("#play-area").css("opacity", .05);
      obj.remove();
    }, 750);
    setTimeout(function() {
      $("#play-area").css("opacity", 1);
    }, 900);
    setTimeout(function() {
      $("#storm-cloud").removeClass("active");
    }, 1250);
    setTimeout(pickWord, 2500);
  }

  function destroyByBoot(obj) {
    $("#boot").addClass("active").css("left", obj.position().left - $("#boot").width() / 2);
    obj.attr("speed", 0);
    setTimeout(function() {
      obj.remove();
    }, 350);
    setTimeout(function() {
      $("#boot").removeClass("active");
    }, 1000);
    setTimeout(pickWord, 2000);
  }

  function destroyByNyan(obj) {
    $("#nyan").addClass("active");
    setTimeout(function() {
      obj.remove();
    }, 500);
    setTimeout(function() {
      $("#nyan").remove();
      $("<img/>", {
        id: "nyan",
        class: "destroyer",
        src: "assets/nyan.gif",
        alt: "nyan cat"
      }).appendTo("#play-area");
    }, 1000);
    setTimeout(pickWord, 2000);
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
    clearFields($("#answer"), $("#goal"));
    $("#answer").off();
    setTimeout(function() {
      $("#play-area").addClass("scores");
      getScores();
    }, 1500);
  }

  function attachHandlers() {
    $("#answer").on('keyup', function(evt) {
      var field = $(this);
      var prev = difficulty;
      if (field.val() === goal) {
        streak++;
        clearFields(field, $("#goal"));
        upperBase *= 1.5;
        difficulty = (difficulty > 21) ? 21 : baseLog(10, upperBase);
      }
    });
  }

  function clearFields(field, goal) {
    destroyObstacle();
    $("#streak").text(streak);
    field.val("");
    field.attr("placeholder", "");
    goal.text("");
  }

  function baseLog(x, y) {
    return Math.log(y) / Math.log(x);
  }

  function getScores() {
    $.get('assets/scores.php', function(data) {
      $("#goal").text("Your Score: " + streak);
      $("#answer").attr("placeholder", "Submit your score by entering a username!").addClass("scoring");
      $("#main > p").css("display", "none");
      var scoresList = $("<ol/>").appendTo("#play-area");
      attachScoreHandlers();
      $.each(data, function(index, value) {
        $("<li/>").html("<span class='score'>" + value.score + "</span><span class='name'>" + value.name + "</span>").appendTo(scoresList);
      });
    });
  }

  function attachScoreHandlers() {
    $("#answer").on('keypress', function(evt) {
      if (evt.which == 13) {
        submitScore($(this).val(), streak);
      }
    });
  }

  function submitScore(name, score) {
    $.post("assets/scores.php", {name: name, score: score})
      .done(function(data) {
        $("ol").remove();
        $("#answer").remove();
        $(".play-again").css("display", "block");
        var scoresList = $("<ol/>").appendTo("#play-area");
        $.each(data, function(index, value) {
          $("<li/>").html("<span class='score'>" + value.score + "</span><span class='name'>" + value.name + "</span>").appendTo(scoresList);
        });
      });
  }

}(window.jQuery, window, document));