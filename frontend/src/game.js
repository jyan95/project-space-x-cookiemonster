//GLOBAL canvas element variables
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const startBtn = document.getElementById('startButton');
const lifebar = document.getElementById("lifebar");
const gameOverCanvas = document.getElementById('gameOver');
/******************************************************************************
* core game logic
******************************************************************************/
let username;
let signIn = false;
let score;
let timerCount = 0;
let lifeArr = ["+","+","+"];
let cookieCount;

startBtn.addEventListener('click', () => {
  canvas.style.display = '';
  console.log('clicked start');
  window.requestAnimationFrame(draw);
  startBtn.style.display = 'none';
  renderLives(lifeArr);
});

function startGame(){
  window.requestAnimationFrame(draw);
};

function gameClock(){
  ++timerCount;
  // gameClock.innerText = timerCount.toString(10).toMMSS()
};

function calculateScore(time, count){
  //calculate score based on time survived and objs picked up
};

function renderLives(lifeArr){
  lifebar.innerHTML = '';
  lifeArr.forEach(life => {
    lifebar.innerHTML += life;
  })
};

function playerHit(){
  console.log('hit');
  lifeArr.pop();
  renderLives(lifeArr);
  if(lifeArr.length === 0){
    gameOver();
  }
};

function increaseScore(){
  console.log('++');
  ++cookieCount;
  if (count === 10) {
    lifeArr.push(life)
    renderLives();
  }
};

function gameOver(){
  console.log("GAME OVER");
  //save score here
  //replace canvas html(?)
  canvas.style.display = 'none';
  //need to stop the draw / request animation frame function
  gameOverCanvas.style.display = ''

};

//posting the username to the player database

/******************************************************************************
* player canvas element
******************************************************************************/
let pR = 12;
let pX = canvas.width/2;
let pY = canvas.height/2;
let pDx = 5;
let pDy = 5;

function drawPlayer(){
  ctx.beginPath();
  ctx.arc(pX, pY, pR, 0, Math.PI*2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
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
function doKeyDown(e){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  onkeydown = onkeyup = function(e){
    direction[e.keyCode] = e.type == 'keydown';
  }
};

document.addEventListener("keydown", doKeyDown, true)

/******************************************************************************
* enemy canvas element
******************************************************************************/
let enemySpawnRate = 2500;
let enemyLastSpawn = Date.now()+1000;
let enemies = [];

//spawn code starts here
function spawnEnemy() {
  let t;

  if (Math.random() < 0.5) {
    t = 'red';
  } else {
    t = 'blue';
  } //randomize obj color

  let object = {
    type: t,
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 50) + 25,
    r: 8,
    dx: Math.random()*2,
    dy: Math.random()*2,
    cooldown: false //for use in collision detection
  }

  enemies.push(object);
}; //spawn code ends here

//to prevent objects from getting stuck
function respawn(o, player){
  o.x = Math.random() * (canvas.width - 30) + 15;
  o.y = Math.random() * (canvas.height - 50) + 25
};

function bounceLogic(o){
  if (o.y + o.dy < 0 || o.y + o.dy > canvas.height) {
    o.dy = -o.dy;
  };

  if (o.x + o.dx < 0 || o.x + o.dx > canvas.width) {
    o.dx = -o.dx;
  };
};

function cooldownLogic(o){
  if (o.cooldown === false ) {
    // console.log('HIT');
    playerHit(); //function to decrease player life
    o.cooldown = true
    setTimeout(()=> o.cooldown === false, 500);
  };
};

//draw enemy loop for animate function
function enemyLoop(player) {
  for(let i = 0; i < enemies.length; i++) {

    let o = enemies[i];
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
    ctx.fillStyle = o.type;
    ctx.fill();
    ctx.closePath();

    //collision code start
    // find distance between midpoints
    let dx = o.x - player.x;
    let dy = o.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if(distance <= player.r + o.r){
      respawn(o);
      cooldownLogic(o); //invulnerability timer
      o.dx = -o.dx;
      o.dy = -o.dy;
      // console.log('hit');
    };//collision code end

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
* cookie canvas element
******************************************************************************/
let cookieSpawnRate = 10000;
let cookieLastSpawn = Date.now()+1000;
let cookies = [];

function spawnCookie() {
  let object = {
    type: 'green',
    x: Math.random() * (canvas.width - 30) + 15,
    y: Math.random() * (canvas.height - 50) + 25,
    r: 5,
  }
  cookies.push(object);
};

//draw cookie loop for animate function
function cookieLoop(player) {
  for(let i = 0; i < cookies.length; i++) {

    let c = cookies[i];
    ctx.beginPath();
    ctx.arc(c.x, c.y, c.r, 0, Math.PI*2);
    ctx.fillStyle = 'green';
    ctx.fill();
    ctx.closePath();

    let dx = c.x - player.x;
    let dy = c.y - player.y;
    let distance = Math.sqrt(dx * dx + dy * dy);

    if(distance <= player.r + c.r){
      c.x = -10;
      c.y = -10;
      // increaseScore();
      console.log("++");
    }
  }
};

/******************************************************************************
* animate and draw code
******************************************************************************/
//animate code starts here
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

  let player = { r: pR, x: pX, y: pY };

  enemyLoop(player);
  cookieLoop(player);
};//animate code end


//main draw loop start
function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animate();
  drawPlayer();

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
};//main draw loop end

/******************************************************************************
* mouse control using pointer lock API
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

// *******************
//main game draw function
// window.requestAnimationFrame(draw);
