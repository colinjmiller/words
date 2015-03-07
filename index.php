<!DOCTYPE html>
<html>
  <head>
    <title>Trip Up</title>
    <!-- <script src='https://cdn.firebase.com/js/client/2.2.1/firebase.js'></script> -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script> 
    <link href="assets/style.css" rel="stylesheet" />
    <script src="assets/scripts.js"></script>
  </head>
  <body>
    <div id="main">
      <h1>Trip Up</h1>
      <div id="play-area">
        <span id="goal">Loading...</span>
        <div id="runner">
          <div class="head"></div>
          <div class="upper-arm left">
            <div class="lower"></div>
          </div>
          <div class="upper-arm right">
            <div class="lower"></div>
          </div>
          <div class="leg left">
            <div class="leg lower"></div>
          </div>
          <div class="leg right">
            <div class="leg lower"></div>
          </div>
        </div>
        <img class="background back" src="assets/land-0.svg" alt="Slow-moving background" />
        <img class="background back second" src="assets/land-0.svg" alt="Slow-moving background" />
        <img class="background back third" src="assets/land-0.svg" alt="Slow-moving background" />
        <img class="background middle" src="assets/land-1.svg" alt="Medium-speed background" />
        <img class="background middle second" src="assets/land-1.svg" alt="Medium-speed background" />
        <img class="background middle third" src="assets/land-1.svg" alt="Medium-speed background" />
        <img class="background front" src="assets/land-2.svg" alt="Medium-speed background" />
        <img class="background front second" src="assets/land-2.svg" alt="Medium-speed background" />
        <img class="background front third" src="assets/land-2.svg" alt="Medium-speed background" />
        <img class="destroyer" id="storm-cloud" src="assets/storm-cloud.svg" alt="storm cloud" />
        <img class="destroyer" id="boot" src="assets/boot.svg" alt="boot" />
        <img class="destroyer" class="active goingback" id="nyan" src="assets/nyan.gif" alt="nyan cat" />
      </div>
      <input id="answer" type="text" placeholder="Type Here" />
      <p>
        Current Streak:
        <span id="streak">0</span>
      </p>
    </div>
  </body>
</html>