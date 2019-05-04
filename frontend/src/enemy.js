/******************************************************************************
* enemy canvas element
******************************************************************************/
let ballRadius = 10;
let x = canvas.width/2;
let y = canvas.height-50;
let dx = 2;
let dy = -2;

function drawBall(){
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI*2);
  ctx.fillStyle = "green";
  ctx.fill();
  ctx.closePath();
};

function draw(){
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBall();

  if (x + dx > canvas.width-ballRadius || x + dx < ballRadius){
    dx = -dx;
  }

  if (y + dy > canvas.height-ballRadius || y + dy < ballRadius) {
    dy = -dy;
  }

  //bounce off top and bottom
  //if y val of ball pos is < 0 or greater than canvas height, reverse direction
  if (y + dy < 0 || y + dy > canvas.height) {
    dy = -dy;
  };
  //bounce off left and right
  if (x + dx < 0 || x + dx > canvas.width) {
    dx = -dx;
  };

  x += dx;
  y += dy;
};

setInterval(draw, 15); //ball speed
