// for wip purposes
/******************************************************************************
* player canvas element
******************************************************************************/
let playerRadius = 50;
let pX = canvas.width/2;
let pY = canvas.height/2;
let pDx = 10;
let pDy = 10;

function drawPlayer(){
  ctx.beginPath();
  ctx.arc(pX, pY, playerRadius, 0, Math.PI*2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
};

function doKeyDown(e){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  switch (e.keyCode) {
    case 38:  /* Up arrow was pressed */
      if (pY > playerRadius){
      pY -= pDy;
      }
      break;
    case 40:  /* Down arrow was pressed */
      if (pY < canvas.height - playerRadius){
      pY += pDy;
      }
      break;
    case 37:  /* Left arrow was pressed */
      if (pX > playerRadius){
      pX -= pDx;
      }
      break;
    case 39:  /* Right arrow was pressed */
      if (pX < canvas.width - playerRadius){
      pX += pDx;
      }
      break;
  }
}

document.addEventListener("keydown", doKeyDown, true)

setInterval(drawPlayer, 5)
