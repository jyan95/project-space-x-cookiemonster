// for wip purposes
/******************************************************************************
* player canvas element
******************************************************************************/
let pR = 10;
let pX = canvas.width/2;
let pY = canvas.height/2;
let pDx = 10;
let pDy = 10;

function drawPlayer(){
  ctx.beginPath();
  ctx.arc(pX, pY, pR, 0, Math.PI*2);
  ctx.fillStyle = "orange";
  ctx.fill();
  ctx.closePath();
};

function doKeyDown(e){
  ctx.clearRect(0, 0, canvas.width, canvas.height)
  switch (e.keyCode) {
    case 38:  /* Up arrow was pressed */
      if (pY > pR){
      pY -= pDy;
      }
      break;
    case 40:  /* Down arrow was pressed */
      if (pY < canvas.height - pR){
      pY += pDy;
      }
      break;
    case 37:  /* Left arrow was pressed */
      if (pX > pR){
      pX -= pDx;
      }
      break;
    case 39:  /* Right arrow was pressed */
      if (pX < canvas.width - pR){
      pX += pDx;
      }
      break;
  }
}

document.addEventListener("keydown", doKeyDown, true)

// setInterval(drawPlayer, 5)
