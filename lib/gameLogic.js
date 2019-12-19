var players = {};
/* Messages */
let messages = [];
/*player movement variables*/
const speed = 2;
const dagSpeedMod = speed * .25;
/*room size variables*/
const roomHeight = 550;
const roomWidth = 750;
// question marks
let questionsWidth = 30;
let questionsHeight = 30;
var questions = {
    "1": {
        x: Math.random() * roomWidth,
        y: Math.random() * roomHeight,
        width: questionsWidth,
        height: questionsHeight
    },
    "2": {
        x: Math.random() * roomWidth,
        y: Math.random() * roomHeight,
        width: questionsWidth,
        height: questionsHeight
    }
};
/*player size variables*/
const playerWidth = 30;
const playerHeight = 30;
/* Leaderboard that holds ordered list of top 10 players */
let leaderboard = [];
// helper movement function
let movement = function (data) {
    let xMove = 0;
    let yMove = 0;
    if (data.left && !data.right) {
        if (data.up || data.down) {
            xMove = -(speed - dagSpeedMod);
        } else {
            xMove = -speed
        }
    }
    if (data.right && !data.left) {
        if (data.up || data.down) {
            xMove = speed - dagSpeedMod;
        } else {
            xMove = speed;
        }
    }
    if (data.up && !data.down) {
        if ((data.left || data.right) && !(data.left && data.right)) {
            yMove = -(speed - dagSpeedMod);
        } else {
            yMove = -speed;
        }
    }
    if (data.down && !data.up) {
        if ((data.left || data.right) && !(data.left && data.right)) {
            yMove = speed - dagSpeedMod;
        } else {
            yMove = speed;
        }
    }
    return {
        "xMove": xMove,
        "yMove": yMove
    }
}
// helper collision function
// returns true if there is a collision and false if not
let collisionDetection = function (rect1, rect2) {
    if (rect1 && rect2) {
        if (rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y) {
            return true;
        } else {
            return false;
        }
    }
}
/* Randomizes the type of player */
// am going to experiment with only letting you switch to one you are not
let randomizeType = function (p) {
    // let typeNum = Math.floor(Math.random() * 3) + 1;
    // if (typeNum == 1) {
    //     p.type = "rock";
    // } else if (typeNum == 2) {
    //     p.type = "paper";
    // } 
    // else if (typeNum == 3) {
    //     p.type = "scizzors";
    // }
    let typeNum = Math.floor(Math.random() * 2) + 1;
    if (typeNum == 1) {
        p.type == "rock" ? p.type = "scizzors" : p.type == "scizzors" ? p.type = "paper" : p.type == "paper" ? p.type = "rock" : p.type = "rock";
    } else if (typeNum == 2) {
        p.type == "rock" ? p.type = "paper" : p.type == "scizzors" ? p.type = "rock" : p.type == "paper" ? p.type = "scizzors" : p.type = "rock";
    }
}
let checkCollisionOfPlayers = function () {
    let brk = false;
    for (id in players) {
        // check if the player is colliding with a question mark
        for (qId in questions) {
            if (collisionDetection(players[id], questions[qId])) {
                questions[qId].x = Math.random() * roomWidth;
                questions[qId].y = Math.random() * roomHeight;
                randomizeType(players[id]);
            }
        }
        // check if the player is colliding with another player
        for (id2 in players) {
            if (id != id2) {
                if (collisionDetection(players[id], players[id2])) {
                    // console.log(players[id].name + " collided with " + players[id2].name);
                    if (players[id].type == "rock" && players[id2].type == "paper") {
                        players[id2].score += 10;
                        players[id] = {};
                        sortLeaderboard();
                        brk = true;
                        break;
                    } else if (players[id].type == "paper" && players[id2].type == "scizzors") {
                        players[id2].score += 10;
                        players[id] = {};
                        sortLeaderboard();
                        brk = true;
                        break;
                    } else if (players[id].type == "scizzors" && players[id2].type == "rock") {
                        players[id2].score += 10;
                        players[id] = {};
                        sortLeaderboard();
                        brk = true;
                        break;
                    }
                }
            }
        }
        if (brk) {
            break;
        }
    }
}
/* Update the scoreboard object */
let sortLeaderboard = function () {
    for (i in players) {
        if (players[i].name != undefined && players[i].name != "undefined") {
            // check if the leaderboard already has the player in it
            if (leaderboard.some(p => {
                if (p.id === i) {
                    p.score = players[i].score;
                    return true;
                } else {
                    return false;
                }
            })) {

            } else { // else add a new player
                leaderboard[leaderboard.length] = {
                    "name": players[i].name,
                    "score": players[i].score,
                    "id": i
                }
            }
        }
    }
    leaderboard.sort(function (a, b) {
        return parseFloat(b.score) - parseFloat(a.score);
    });
}
module.exports = {
    players: players,
    questions: questions,
    state: {
        "players": players,
        "questions": questions,
        "leaderboard": leaderboard,
        "messages": messages
    },
    playerInput: function (socket) {
        socket.on('new player', function (data) {
            players[socket.id] = {
                name: data.name,
                type: data.type,
                score: data.score,
                x: 0 + (Math.random() * (roomWidth)),
                y: 0 + (Math.random() * (roomHeight)),
                height: playerHeight,
                width: playerWidth
            };
        });
        socket.on('movement', function (data) {
            var player = players[socket.id] || {};
            let move = movement(data);
            if (player.x + move.xMove > 0 && player.x + move.xMove < roomWidth) {
                player.x += move.xMove;
            }
            if (player.y + move.yMove > 0 && player.y + move.yMove < roomHeight) {
                player.y += move.yMove;
            }
            checkCollisionOfPlayers();
        });
        socket.on('message', function (data) {
            messages.push(data);
            // messages.unshift(data);
            // messages = messages.slice(0,11);
        });
    },
    disconnectPlayer: function (socket) {
        console.log('a user connected');
        socket.on('disconnect', function () {
            console.log('user disconnected');
            players[socket.id] = {};
        });
    }
}