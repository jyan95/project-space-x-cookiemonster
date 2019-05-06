/******************************************************************************
* enemy canvas element
******************************************************************************/
let spawnRate = 2500;
let lastSpawn = -10;
let objects = [];

//spawn code starts here

function spawn() {
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
    dx: Math.random(),
    dy: Math.random()
  }

  objects.push(object);
}; //spawn code ends here

//animate code starts here
function animate() {
  let time = Date.now();
  if (time > (lastSpawn + spawnRate)) {
    lastSpawn = time;
    spawn();
  }

  //  calculate bounds of player obj here
  // let playerLeft = playerX;
  // let playerRight = playerX+playerWidth;
  // let playerTop = playerY;
  // let playerBot = playerY+playerHeight;

  //animate code ends here
  for(let i = 0; i < objects.length; i++) {

    let o = objects[i];
    ctx.beginPath();
    //need to build conditional to prvent spawn on player obj here(?0)
    ctx.arc(o.x, o.y, o.r, 0, Math.PI*2);
    ctx.fillStyle = o.type;
    ctx.fill();
    ctx.closePath();

    //collision code starts here
    //  calculate bounds of last spawned ball
    let top = o.y - o.r;
    let bot = o.y + o.r;
    let left = o.x - o.r;
    let right = o.x + o.r;

    // if(top === playerBot || bot === playerTop || left === playerRight || right === playerLeft){
    //   playerHit(); //function to decrease player life
    // };//end of collision code, not sure if it works :P


    //direction on spawn
    if (o.x + o.dx > canvas.width-o.r || o.x + o.dx < o.r){
      o.dx = -o.dx;
    };

    if (o.y + o.dy > canvas.height-o.r || o.y + o.dy < o.r) {
      o.dy = -o.dy;
    };

    //bounce code starts here
    if (o.y + o.dy < 0 || o.y + o.dy > canvas.height) {
      o.dy = -o.dy;
    };

    if (o.x + o.dx < 0 || o.x + o.dx > canvas.width) {
      o.dx = -o.dx;
    };

    o.x += o.dx;
    o.y += o.dy;
  }

};//animate code ends here


function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  animate();

};

setInterval(draw, 15);
