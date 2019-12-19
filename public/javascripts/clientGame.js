var socket = io();
// object for players movement
var defaultMovement = {
  up: false,
  down: false,
  left: false,
  right: false
};
var movement = defaultMovement;
/* Dialog box to get users name */
$(window).on('load',function(){
  $('#nameModal').modal('show');
});

$('#nameBtn').click(function() {
  name = $('#nameInput').val();
  createNewPlayer();
});

/* Chat Box*/
$('#chatSubmit').click(function() {
  let message = $('#chatInput').val();
  $('#chatInput').val('');
  if(message && message.length > 0) {
    socket.emit('message', {
      name: name,
      time: (new Date()).getTime(),
      message: message
    });
  }
});
// read players movement and send it to the server
document.addEventListener('keydown', function (event) {
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
});
document.addEventListener('keyup', function (event) {
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
});
let createNewPlayer = function() {
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
  if(name) {
    socket.emit('new player', {
      name: name,
      type: type,
      score: 0
    });
  }
}
// send input 60 times a second
setInterval(function () {
  socket.emit('movement', movement);
  movement = defaultMovement;
}, 1000 / 60);

/*Here is where we draw everything*/
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
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
  if (players[socket.io.engine.id]) {
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