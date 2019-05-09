//GLOBAL HTML ELEMENT VARIABLES
const PLAYERS_URL = "http://localhost:3000/players"
const GAMES_URL = "http://localhost:3000/games"
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById('startButton');
const lifebar = document.getElementById("lifebar");
const gameOverCanvas = document.getElementById('gameOver');
const gameDiv = document.getElementsByClassName('col-md-6')[0];
const usernameForm = document.getElementById('usernameForm');
const usernameInput = document.getElementById('usernameInput');

//GAME VARIABLES
let username;
let currentPlayer;
let score = 0;
let timerCount = 0;
let cookieCount = 0;
let animating = false;
let lifeArr = ["♥️","♥️","♥️"];
let request = window.requestAnimationFrame(draw);

//SPRITE SET UP
let playerSprite = new Image();
playerSprite.src = "./assets/player.png";
let enemySprite1 = new Image();
enemySprite1.src = "./assets/enemy1.png";
let enemySprite2 = new Image();
enemySprite2.src = "./assets/enemy2.png";
let enemySprite3 = new Image();
enemySprite3.src = "./assets/enemy3.png";
let enemySprite4 = new Image();
enemySprite4.src = "./assets/enemy4.png";
let cookieSprite = new Image();
cookieSprite = "./assets/cookie.png";
/******************************************************************************
* EVENT LISTENERS
******************************************************************************/
usernameForm.addEventListener('submit', (e) => {
  e.preventDefault();
  let userInput = usernameInput.value;
  console.log(userInput)
  postToPlayers(userInput);
  startBtn.style.display = '';
  usernameForm.style.display = 'none';
});

startBtn.addEventListener('click', () => {
  canvas.style.background = "url('./assets/wall.png')";
  canvas.style.display = '';
  lifebar.style.display = '';
  startBtn.style.display = 'none';
  startGame();
});
/******************************************************************************
* API FETCH FUNCTIONS
******************************************************************************/
function postToPlayers(userInput){
  console.log('posting to players', userInput);
  fetch(PLAYERS_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      username: userInput
    })
  })//end of fetch
  .then(res => res.json())
  .then(playerObj => {
    console.log(playerObj);
    currentPlayer = playerObj;
  })
  //need to grab user ID here
};

function postToGames(){
  // console.log('posting to games');
  // console.log(currentPlayer);
  // console.log(currentPlayer.id);
  fetch(GAMES_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      player_id: currentPlayer.id,
      public_score: score
    })
  })//end fetch
  .then(res => res.json())
  .then(console.log)
  //use response in gameover screen
};

/******************************************************************************
* GAME LOGIC FUNCTIONS
******************************************************************************/
function startGame(){
  animating = true;
  renderLife(lifeArr);
  return request;
};

function gameClock(){
  ++timerCount;
  // gameClock.innerText = timerCount.toString(10).toMMSS()
};

function calculateScore(time, timerCount){
  //calculate score based on time survived and objs picked up
};

function renderLife(lifeArr){
  lifebar.innerHTML = 'Life: ';
  lifeArr.forEach(life => {
    lifebar.innerHTML += life;
  })
};

function playerHit(){
  console.log('hit');
  lifeArr.pop();
  renderLife(lifeArr);
  if(lifeArr.length === 0){
    gameOver();
  }
};

function eatCookie(){
  console.log('++');
  cookieCount += 1;
  console.log(cookieCount);
  score += 100;
  console.log(score);
  if (cookieCount === 10) {
    lifeArr.push("♥️")
    renderLife(lifeArr);
    cookieCount = 0;
  }
};

function gameOver(){
  animating = false;
  cancelAnimationFrame(request);
  postToGames();
  //reset canvas here
};
/******************************************************************************
* PLAYER CANVAS ELEMENT
******************************************************************************/
let pR = 12;
let pX = canvas.width/2;
let pY = canvas.height/2;
let pDx = 5;
let pDy = 5;

function drawPlayer(){
  ctx.beginPath();
  ctx.arc(pX, pY, pR, 0, Math.PI*2);
  ctx.fillStyle = "rgba(0, 0, 0, 0)";
  ctx.fill();
  ctx.closePath();
  ctx.drawImage(playerSprite, pX, pY, 30, 30);
};

//mouse control
// let offsetLeft = canvas.offsetLeft;
// let offsetTop = canvas.offsetTop;
// console.log(offsetLeft, offsetTop)
//
//  canvas.addEventListener("mousemove", mouseMoveHandler, false);
//
//  function mouseMoveHandler(e) {
//   pX = e.clientX - offsetLeft - offsetTop;
//   pY = e.clientY - (2 * offsetTop);
//   // console.log(pX, pY)
// };

//direction keys
let direction = {};
function doKeyDown(e) {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  onkeydown = onkeyup = function(e){
    direction[e.keyCode] = e.type == 'keydown';
  }
};

document.addEventListener("keydown", doKeyDown, true)

/******************************************************************************
* ENEMY CANVAS ELEMENT
******************************************************************************/
let enemySpawnRate = 2000;
let enemyLastSpawn = Date.now()+1000;
let enemies = [];

//spawn code starts here
function spawnEnemy() {
  let t;
  //randomize obj color
  if (Math.random() < 0.25) {
    t = enemySprite1;
  } else if (Math.random() < 0.5) {
    t = enemySprite2;
  } else if (Math.random() < 0.75) {
    t = enemySprite3;
  } else {
    t = enemySprite4;
  }

  let object = {
    type: t,
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 50) + 25,
    r: 8,
    dx: Math.random()*2,
    dy: Math.random()*2,
  }

  enemies.push(object);
}; //spawn code ends here

//to prevent objects from getting stuck
function removeObj(o) {
  o.x = canvas.width + 100;
  o.y = canvas.hieght + 100;
};

function bounceLogic(o) {
  if (o.y + o.dy < 0 || o.y + o.dy > canvas.height) {
    o.dy = -o.dy;
  };

  if (o.x + o.dx < 0 || o.x + o.dx > canvas.width) {
    o.dx = -o.dx;
  };
};

function cooldownLogic(o, player){
  if (player.cooldown === false ) {
    // console.log('HIT');
    playerHit(); //function to decrease player life
    removeObj(o); //remove enemy element upon collision
    player.cooldown = true;
    setTimeout(()=> player.cooldown === false, 500); //0.5s collision off
  };
};

//draw enemy loop for animate function
function enemyLoop(player) {
  for(let i = 0; i < enemies.length; i++) {

    let o = enemies[i];
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fill();
    ctx.closePath();
    ctx.drawImage(o.type, o.x, o.y, 30, 30);

    //collision code
    // find distance between midpoints
    let dx = o.x - player.x;
    let dy = o.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if(distance < player.r + o.r) {
    // if(distance < 30) {
      cooldownLogic(o, player); //invulnerability timer
      o.dx = -o.dx;
      o.dy = -o.dy;
      // console.log('hit');
    };

    //direction on spawn
    if (o.x + o.dx > canvas.width-o.r || o.x + o.dx < o.r){
      o.dx = -o.dx;
    };
    if (o.y + o.dy > canvas.height-o.r || o.y + o.dy < o.r) {
      o.dy = -o.dy;
    };

    bounceLogic(o);
    o.x += o.dx;
    o.y += o.dy;
  }
};//enemy obj loop ends

/******************************************************************************
* COOKIE CANVAS ELEMENT
******************************************************************************/
let cookieSpawnRate = 5000;
let cookieLastSpawn = Date.now()+1000;
let cookies = [];

function spawnCookie() {
  let cookie = {
    type: 'green',
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 50) + 25,
    r: 5,
  }
  cookies.push(cookie);
};

//draw cookie loop for animate function
function cookieLoop(player) {
  for(let i = 0; i < cookies.length; i++) {

    let c = cookies[i];
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
    ctx.fillStyle = "rgba(0, 0, 0, 0)";
    ctx.fill();
    ctx.closePath();
    // ctx.drawImage(cookieSprite, c.x, c.y, 20, 20);

    //despawn cookie after 5 seconds
    setTimeout(()=> c.x = -10, 3000);
    setTimeout(()=> c.y = -10, 3000);

    let dx = c.x - player.x;
    let dy = c.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if(distance <= player.r + c.r) {
    // if(distance <= 10) {
      c.x = -10;
      c.y = -10;
      eatCookie();
      // console.log("++");
    }
  }
};

/******************************************************************************
* ANIMATE AND DRAW FUNCTIONS
******************************************************************************/
//animate code
function animate() {
  let time = Date.now();
  if (time > (enemyLastSpawn + enemySpawnRate)) {
    enemyLastSpawn = time;
    spawnEnemy();
  }

  if (time > (cookieLastSpawn + cookieSpawnRate)) {
    cookieLastSpawn = time;
    spawnCookie();
  }

  let player = { r: pR, x: pX, y: pY, cooldown: false };

  enemyLoop(player);
  cookieLoop(player);
};


//main draw
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (animating) {
    animate();
    drawPlayer();
  }

  //arrow key control code included here for smooth movemement
  //Up and left
  if (direction[38] && direction[37]) {
    if (pY > pR && pX > pR) {
      pY -= pDy;
      pX -= pDx;
    }
  }
  //Down and left
  else if (direction[40] && direction[37]) {
    if (pY < canvas.height - pR && pX > pR) {
      pY += pDy;
      pX -= pDx;
    }
  }
  //Up and right
  else if (direction[38] && direction[39]) {
    if (pY > pR && pX < canvas.width - pR) {
      pY -= pDy;
      pX += pDx;
    }
  }
  //Down and right
  else if (direction[40] && direction[39]) {
    if (pY < canvas.height - pR && pX < canvas.width - pR) {
      pY += pDy;
      pX += pDx;
    }
  }
  //Up
  else if (direction[38]) {
    if (pY > pR) {
      pY -= pDy;
    }
  }
  //Down
  else if (direction[40]) {
    if (pY < canvas.height - pR) {
      pY += pDy;
    }
  }
  //Left
  else if (direction[37]) {
    if (pX > pR) {
      pX -= pDx;
    }
  }
  //Right
  else if (direction[39]) {
    if (pX < canvas.width - pR) {
      pX += pDx;
    }
  }
  window.requestAnimationFrame(draw);
};//main draw end

/******************************************************************************
* POINTER LOCK API for MOUSE CONTROL
******************************************************************************/
const RADIUS = 20;
// pointer lock object forking for cross browser
canvas.requestPointerLock = canvas.requestPointerLock ||
                            canvas.mozRequestPointerLock;

document.exitPointerLock = document.exitPointerLock ||
                           document.mozExitPointerLock;

canvas.onclick = function() {
  canvas.requestPointerLock();
};

// pointer lock event listeners
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

function lockChangeAlert() {
  if (document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas) {
    console.log('The pointer lock status is now locked');
    document.addEventListener("mousemove", updatePosition, false);
  } else {
    console.log('The pointer lock status is now unlocked');
    document.removeEventListener("mousemove", updatePosition, false);
  }
};

function updatePosition(e) {
  pX += e.movementX;
  pY += e.movementY;

  //wall detection logic
  // if (pY > pR && pX > pR) {
  //   pY -= pDy;
  //   pX -= pDx;
  // }
  // if (pY < canvas.height - pR && pX > pR) {
  //   pY += pDy;
  //   pX -= pDx;
  // }
  // if (pY > pR && pX < canvas.width - pR) {
  //   pY -= pDy;
  //   pX += pDx;
  // }
  // if (pY < canvas.height - pR && pX < canvas.width - pR) {
  //   pY += pDy;
  //   pX += pDx;
  // }
  // if (pY > pR) {
  //   pY -= pDy;
  // }
  // if (pY < canvas.height - pR) {
  //   pY += pDy;
  // }
  // if (pX > pR) {
  //   pX -= pDx;
  // }
  // if (pX < canvas.width - pR) {
  //   pX += pDx;
  // }

  // pacman-esque map movement
  if (pX > canvas.width + RADIUS) {
    pX = -RADIUS;
  }
  if (pY > canvas.height + RADIUS) {
    pY = -RADIUS;
  }
  if (pX < -RADIUS) {
    pX = canvas.width + RADIUS;
  }
  if (pY < -RADIUS) {
    pY = canvas.height + RADIUS;
  }
};
