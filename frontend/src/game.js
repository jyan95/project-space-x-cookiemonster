/******************************************************************************
* core game elements
******************************************************************************/
let username;
let signIn = false;
let score;
let clock = 0;

function startGame(){

};

function clock(){
  // ++clock
  // clock.innerText = clock.toString(10).toMMSS()
};

function calculateScore(time, count){
  //calculate score based on time survived and objs picked up
};

function renderLives(){
  lifebar.innerHTML = ''
  lifeArr.forEach(life => {
    lifebar.innerHTML += life
  })
};

function playerHit(){
  lifeArr.pop();
  renderLives(lifeArr);
};

function gameOver(){

};
