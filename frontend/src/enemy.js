/******************************************************************************
* enemy canvas element
******************************************************************************/
let enemySpawnRate = 2500;
let enemyLastSpawn = -10;
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
    r: 5,
    dx: Math.random()+1,
    dy: Math.random()+1,
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
    console.log('HIT');
    // playerHit(); //function to decrease player life
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

    //collision code starts here
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
    };//end of collision code

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


function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animate();
  drawPlayer();
  window.requestAnimationFrame(draw);
};

// let interval = setInterval(draw, 10);

window.requestAnimationFrame(draw);
