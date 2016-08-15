/* start make our screen */
let screen = document.querySelector('.screen');

for (let i = 0; i < 75; i++) {
  let node = document.createElement('div');
  node.classList.add('bar');
  screen.appendChild(node);
}

let index = 0;
let all = document.querySelectorAll('.bar');
let total = all.length;
let last = null;

setInterval(() => {
  last = index;
 
  if (index === total - 1) {
    index = 0;
  } else {
    index++;
  }
  
  all[index].classList.add('light');
  all[last].classList.remove('light');
}, 15);
/* end make our screen */

/* start game */
/* 800*600 */
let canvas = document.querySelector('.c');
let w = 800;
let h = 600;
canvas.width = w;
canvas.height = h;
let context = canvas.getContext('2d');
let dir = 0;
let player = { x:30, y: 420, vx: 0, vy: 0, bAcross: 5, bDown: 9, bSize: 10 };

player.blocksMain = [
  '0','0','p','0','0',
  '0','0','r','0','0',
  '0','r','r','r','0',
  '0','r','p','r','p',
  '0','0','r','0','0',
  '0','0','r','0','0',
  '0','b','b','b','0',
  '0','b','0','b','0',
  'b','0','b','0','0',
  'd','t','d','t','0',
];

player.blocksDown = [
  '0','0','0','0','0',
  '0','0','p','0','0',
  '0','0','r','0','0',
  '0','r','r','r','0',
  '0','r','p','r','p',
  '0','0','r','0','0',
  '0','b','b','b','0',
  '0','b','0','b','0',
  'b','0','b','0','0',
  'd','t','d','t','0',
];

player.blocksWalk = [
  '0','0','0','0','0',
  '0','0','p','0','0',
  '0','0','r','0','0',
  '0','r','r','r','0',
  '0','r','p','r','p',
  '0','0','r','0','0',
  '0','b','b','b','0',
  'b','b','0','b','0',
  'd','0','0','b','0',
  't','0','0','d','t',
];


player.colours = {
  'r': 'a32e2e',
  'b': '2e6fa3',
  'p': '85655a',
  'd': '582828',
  't': '703c3c'
}

/* input */
let left = 37;
let space = 32;
let right = 39; 
let g = 71;
let lastKey;

document.addEventListener('keydown', (e) => {
  lastKey = e.keyCode;
  if (e.keyCode === left) {
    dir = -1;
  }

  if (e.keyCode === right) {
    dir = 1;
  }

  if (e.keyCode === space) {
    player.jumping = true;
    //player.vy += 50;
    // want to count up here
  }
});

document.addEventListener('keyup', (e) => {
  //if (lastKey == left || lastKey == right) {
    dir = 0;
  //}  
});


let = cx = 0;
let lastTimestamp = null;
let tick = false;

const render = (timestamp) => {

  if (player.vy < 50 && player.jumping) {
    player.vy+=3
  } 

  if (player.vy > 50 && player.jumping) {
    player.jumping = false;
  }

  if (player.vy > 0 && player.jumping === false) {
    player.vy-=3;
  }

  if (lastTimestamp === null || timestamp - lastTimestamp >= 500) {
    lastTimestamp = timestamp;
    tick = tick ? false : true;
  }

  if (dir === 1) {
    cx -=3;
    //player.x +=1;
    player.vx +=3;
  }

  if (dir === -1) {
    cx +=3;
    //player.x -=1;
    player.vx -=3;
  }


  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(cx, 0, w + player.vx, h);
  // Restore the transform
  context.restore();

  context.fillStyle = 'white';

  context.translate(cx, 0);
  //context.fillRect(player.x, player.y, 20, 20);

  /* start top left down to bottom right moving from left to right top to bottom */
  startX = (player.bDown * player.bSize) - player.x;
  startY = player.y;

  currentX = startX;
  currentY = startY;

  var state;

  if (tick) {
    state = player.blocksMain;
  } else {
    if (dir) {
      state = player.blocksWalk;
    } else {
      state = player.blocksDown;
    }
  }

  state.forEach((block, index) => {
    context.fillStyle = block === '0' ?  'black' : '#' + player.colours[block];
    context.fillRect( (currentX + player.vx), currentY - player.vy, player.bSize, player.bSize);

    if ((index+1) % player.bAcross === 0) {
      // new line
      currentX = startX;
      currentY += player.bSize;
    } else {
      currentX += player.bSize;
    }
  });

  context.fillStyle = 'white';

  context.fillRect(150, 500, 20, 20);
  context.fillRect(250, 500, 20, 20);
  context.fillRect(450, 500, 20, 20);
  context.fillRect(550, 500, 20, 20);

  context.fillRect(850, 500, 20, 20);
  context.setTransform(1, 0, 0, 1, 0, 0);

  requestAnimationFrame(render);
}
requestAnimationFrame(render);