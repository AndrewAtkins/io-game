var socket = io();
// object for players movement
let myX, myY, moveX, moveY, touching;
/* Player size variables */
const playerWidth = 30;
const playerHeight = 30;
var defaultMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};
var movement = defaultMovement;

/* Dialog box to get users name */
$(window).on('load', function () {
  $('#nameModal').modal('show');
});

$('#nameBtn').click(function () {
  name = $('#nameInput').val();
  createNewPlayer();
});

/* Chat Box*/
$('#chatSubmit').click(function () {
  let message = $('#chatInput').val();
  $('#chatInput').val('');
  if (message && message.length > 0) {
    socket.emit('message', {
      name: name,
      time: (new Date()).getTime(),
      message: message
    });
  }
});
$(document).ready(function () {
  /* Play song */
  let myAudio = document.getElementById("song");
  myAudio.addEventListener('ended', function () {
    this.currentTime = 0;
    this.play();
  }, false);
  myAudio.play();
  document.getElementById("song").muted = false;
  /* On screen keyboard */
  $('#keyboard').click(function () {
    if (!($('.modal.in').length)) {
      $('#keyboardModalDialog').css({
        top: 0,
        left: 0
      });
    }
    $('#keyboardModal').modal({
      backdrop: false,
      show: true
    });

    $('#keyboardModalDialog').draggable({
      handle: ".modal-header"
    });
  });
})
let setAllMovementsFalse = () => {
  movement.up = false;
  movement.down = false;
  movement.left = false;
  movement.right = false;
};
/* Movment using onscreen keyboard */
$("#upKey,#downKey,#leftKey,#rightKey,#upLeftKey,#upRightKey,#downLeftKey,#downRightKey").on("mouseup mouseout", function (e) {
  setAllMovementsFalse();
});
$("#upKey,#downKey,#leftKey,#rightKey,#upLeftKey,#upRightKey,#downLeftKey,#downRightKey").on("touchend", function (e) {
  setAllMovementsFalse();
});
// up
$("#upKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.up = true;
  }
});
// upkey for touch devices
$("#upKey").on("touchstart", function () {
  movement.up = true;
});
// up left
$("#upLeftKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.up = true;
    movement.left = true;
  }
});
// upLeftKey for touch devices
$("#upLeftKey").on("touchstart", function () {
  movement.up = true;
  movement.left = true;
});
// up right
$("#upRightKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.up = true;
    movement.right = true;
  }
});
// upRightKey for touch devices
$("#upRightKey").on("touchstart", function () {
  movement.up = true;
  movement.right = true;
});
// left
$("#leftKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.left = true;
  }
});
// leftKey for touch devices
$("#leftKey").on("touchstart", function () {
  movement.left = true;
});
// right
$("#rightKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.right = true;
  }
});
// right key for touch devices
$("#rightKey").on("touchstart", function () {
  movement.right = true;
});
// // down left
$("#downLeftKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.down = true;
    movement.left = true;
  }
});
// downleft key for touch devices
$("#downLeftKey").on("touchstart", function () {
  movement.down = true;
  movement.left = true;
});
// down
$("#downKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.down = true;
  }
});
// upkey for touch devices
$("#downKey").on("touchstart", function () {
  movement.down = true;
});
// down right
$("#downRightKey").on("mousedown mouseover", function (e) {
  if (e.buttons == 1 || e.buttons == 3) {
    movement.down = true;
    movement.right = true;
  }
});
// down right key for touch devices
$("#downRightKey").on("touchstart", function () {
  movement.down = true;
  movement.right = true;
});
// read players movement and send it to the server
document.addEventListener('keydown', function (event) {
  if (!$('#keyboardModal').is(':visible')) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = true;
        break;
      case 87: // W
        movement.up = true;
        break;
      case 68: // D
        movement.right = true;
        break;
      case 83: // S
        movement.down = true;
        break;
    }
  }
});
document.addEventListener('keyup', function (event) {
  if (!$('#keyboardModal').is(':visible')) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = false;
        break;
      case 87: // W
        movement.up = false;
        break;
      case 68: // D
        movement.right = false;
        break;
      case 83: // S
        movement.down = false;
        break;
    }
  }
});
let createNewPlayer = function () {
  // notify once that a new player has joined
  // get what type of player spawns in
  let typeNum = Math.floor(Math.random() * 3) + 1;
  let type = "rock";
  if (typeNum == 1) {
    type = "rock";
  } else if (typeNum == 2) {
    type = "paper";
  } else if (typeNum == 3) {
    type = "scizzors";
  }
  if (name) {
    socket.emit('new player', {
      name: name,
      type: type,
      score: 0
    });
  }
}
// send input 60 times a second
setInterval(function () {
  if (moveX && moveY) {
    if (Math.abs(myY - moveY) > 5) {
      
      if ((myY - moveY) > 0) { // where I am minus where I touched
        movement.up = true;
        movement.down = false;
      }  else if ((myY - moveY) < 0) {
        movement.down = true;
        movement.up = false;
      }
    } else {
      moveY = myY;
      movement.up = false;
      movement.down = false;
    }
    if (Math.abs(myX - moveX) > 5) {
      
      if ((myX - moveX) > 0) { // where I am minus where I touched
        movement.left = true;
        movement.right = false;
      }  else if ((myX - moveX) < 0) {
        movement.right = true;
        movement.left = false;
      }
    } else {
      moveX = myX;
      movement.right = false;
      movement.left = false;
    }
  }
  socket.emit('movement', movement);
  movement = defaultMovement;
}, 1000 / 60);

/*Here is where we draw everything*/
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');

/* Adding touch controls to canvas */
let touchDown = (e) => {
  if (e.touches) {
    const rect = canvas.getBoundingClientRect();
    moveX = e.touches[0].clientX - rect.left - playerWidth;
    moveY = e.touches[0].clientY - rect.top - playerHeight;
    console.log("Touch: " + " x: " + moveX + ", y: " + moveY);
    e.preventDefault();
  }
}
canvas.addEventListener("touchstart", touchDown);
canvas.addEventListener("touchmove", touchDown);

/* Code to run everytime the server emits the state */
socket.on('state', function (state) {
  let players = state.players;
  let questions = state.questions;
  let stateLeaderboard = state.leaderboard;
  let messages = state.messages;
  context.clearRect(0, 0, 800, 600);
  /* Update messages */
  let chat = document.getElementById('chat');
  while (chat.firstChild) {
    chat.removeChild(chat.firstChild);
  }
  for (let i = 0; i < messages.length; i++) {
    var name = messages[i].name;
    var message = messages[i].message;
    var entry = document.createElement('li');
    entry.className = "list-group-item";
    entry.setAttribute("style", "word-wrap: break-word;");
    entry.appendChild(document.createTextNode(name + ": " + message));
    chat.appendChild(entry);
  }
  // draw question marks
  for (id in questions) {
    let img = document.getElementById("question");
    context.drawImage(img, questions[id].x, questions[id].y);
  }
  // draw players
  for (var id in players) {
    var player = players[id];
    let img = null;
    if (player.type && player.type == "rock") {
      img = document.getElementById("rock");
    } else if (player.type && player.type == "paper") {
      img = document.getElementById("paper");
    } else if (player.type && player.type == "scizzors") {
      img = document.getElementById("scizzors");
    }
    // draw the players name
    if (player.name) {
      context.font = "15px Arial";
      context.textAlign = "center";
      context.fillText(player.name, player.x + 40 - player.name.length, player.y + 70);
    }
    // draw the image of the player
    if (img) {
      context.drawImage(img, player.x, player.y);
    }
  }
  // display the users score
  if (players[socket.io.engine.id]) { // this if statement checks for your own player
    myX = players[socket.io.engine.id].x;
    myY = players[socket.io.engine.id].y;
    context.font = "50px Arial";
    context.textAlign = "center";
    let scoreText = "" + players[socket.io.engine.id].score;
    if (scoreText == "undefined") {
      scoreText = "";
    }
    context.fillText("Score: " + scoreText, canvas.width - 150, 60); // we get the player here
  }
  // update the client side leaderboard
  let leaderboard = document.getElementById('leaderboard');
  while (leaderboard.firstChild) {
    leaderboard.removeChild(leaderboard.firstChild);
  }
  for (let i = 0; i < stateLeaderboard.length; i++) {
    if (i <= 10) {
      var name = stateLeaderboard[i].name;
      var score = stateLeaderboard[i].score;
      var entry = document.createElement('li');
      entry.appendChild(document.createTextNode(name + " - " + score));
      leaderboard.appendChild(entry);
    }
  }
});