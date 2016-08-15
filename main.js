/* start make our screen */
let screen = document.querySelector('.screen');

for (let i = 0; i < 75; i++) {
  let node = document.createElement('div');
  node.classList.add('bar');
  screen.appendChild(node);
}

let barIndex = 0;
let all = document.querySelectorAll('.bar');
let total = all.length;
let last = null;
let crt = () => {
  last = barIndex;
  (barIndex === total - 1) ? barIndex = 0 : barIndex++;  
  all[barIndex].classList.add('light');
  all[last].classList.remove('light');
}

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
let topDown = false;
let player = { x:30, y: 420, vx: 0, vy: 0, jumpHeight: 100, bAcross: 5, bDown: 9, bSize: 10 };

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

player.spriteMain = '5:9:00p0000r000rrr00rprp00r0000r000bbb00b0b0b0b00dtdt0';
player.spiteDown = '5:9:0000000p0000r000rrr00rprp00r000bbb00b0b0b0b00dtdt0';
player.spriteWalk = '5:9:0000000p0000r000rrr00rprp00r000bbb0bb0b0d00b0t00dt';

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

/* 4x5 */
player.blocksTop = [
  '0' ,'0' ,'r', 'p', '0',
  '0' ,'0' ,'r', 'd', '0',
  '0' ,'0' ,'p', '0', '0',
  '0' ,'0' ,'r', 'd', '0',
  '0' ,'0' ,'r', 'p', '0'
];

player.blocksTopWalkOne = [
  '0' ,'0' ,'r', 'p', '0',
  '0' ,'0' ,'r', 'd', '0',
  '0' ,'0' ,'p', '0', '0',
  '0' ,'0' ,'r', 'd', '0',
  '0' ,'0' ,'r', 'p', '0'
];

player.blocksTopWalkThree = [
  '0' ,'0' ,'r', 'p', '0',
  '0' ,'0' ,'r', 'd', '0',
  '0' ,'0' ,'p', '0', '0',
  '0' ,'0' ,'r', 'd', '0',
  '0' ,'0' ,'r', 'p', '0'
];

//player.blocksTopDown = '2:5:rprdp0rdrp';


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

  if (e.keyCode === g) {
    topDown = (topDown === true) ? false : true;
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
  crt();

  if (player.vy < player.jumpHeight && player.jumping) {
    player.vy+=3
  } 

  if (player.vy > player.jumpHeight && player.jumping) {
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
    cx -=2;
    //player.x +=1;
    player.vx +=2;
  }

  if (dir === -1) {
    cx +=2;
    //player.x -=1;
    player.vx -=2;
  }


  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(cx, 0, w + player.vx, h);
  // Restore the transform
  context.restore();

  context.fillStyle = 'white';

  context.translate(cx, 0);
  //context.fillRect(player.x, player.y, 20, 20);

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

  context.fillStyle = '#79ef7d';
  // build platforms
  if (topDown === false) {
    // paint all these as one?
    context.fillRect(50, 520, 20, 20);
    context.fillRect(70, 520, 60, 40);
    context.fillRect(130, 520, 350, 20);
    context.fillRect(480, 520, 40, 40);
    context.fillRect(520, 520, 30, 30);
    context.fillRect(550, 520, 20, 20);
    context.fillRect(750, 520, 100, 20);
    context.fillRect(850, 520, 120, 30);
  } else {
    context.fillRect(50, 200, 500, 200);
    context.fillRect(750, 200, 220, 200);
  }

  context.setTransform(1, 0, 0, 1, 0, 0);

  if (topDown === false) {
    /* start top left down to bottom right moving from left to right top to bottom */
    startX = (player.bDown * player.bSize) - player.x;
    startY = player.y;
    currentX = startX;
    currentY = startY;

    state.forEach((block, index) => {

      if (block !== '0') {
        context.fillStyle = '#'+player.colours[block];
        context.fillRect( (currentX + player.vx), currentY - player.vy, player.bSize, player.bSize);
      }

      if ((index+1) % player.bAcross === 0) {
        // new line
        currentX = startX;
        currentY += player.bSize;
      } else {
        currentX += player.bSize;
      }
    });
  } else {

    /* for testing top down*/
    startX = (5 * player.bSize) - player.bSize;
    startY = 280;
    currentX = startX;
    currentY = startY;
    player.blocksTop.forEach((block, index) => {

      if (block !== '0') {
        context.fillStyle = '#'+player.colours[block];
        context.fillRect( (currentX + player.vx), currentY - player.vy, player.bSize, player.bSize);
      }

      if ((index+1) % 5 === 0) {
        // new line
        currentX = startX;
        currentY += player.bSize;
      } else {
        currentX += player.bSize;
      }
    })
  }

  // glitch it
  //var screen = canvas.toDataURL();
  //console.log(screen);
  // get correct x,y based on transform etc
  // only do this every few frames
  if (tick) {
    amount = Math.floor(0.01) + ~~(Math.random() * 1.2);
    var imgData = context.getImageData(0, 0, w, h);
    var shiftAmountR = 10 * amount;
    var shiftAmountG = 5 * amount;
    var shiftAmountB = 5 * amount;
    for (var i = 0; i < imgData.data.length; i += 4) {
        var r = imgData.data[i];
        imgData.data[i] = 0;
        var destIdxR = i - (w * (4 * shiftAmountR)) - shiftAmountR * 4;
        if (destIdxR > 0) {
            imgData.data[destIdxR] = r;
        }
        var g = imgData.data[i + 1];
        imgData.data[i + 1] = 0;
        var destIdxG = i - (w * (4 * shiftAmountG)) + 1;
        if (destIdxG > 0) {
            imgData.data[destIdxG] = g;
        }
        var b = imgData.data[i + 2];
        var destIdxB = i - (4 * shiftAmountB) + 2;
        imgData.data[i + 2] = 0;
        if (destIdxB > 0 && destIdxB < imgData.data.length) {
            imgData.data[destIdxB] = b;
        }
    }
    context.putImageData(imgData, 0, 0);
  }

  requestAnimationFrame(render);
}
requestAnimationFrame(render);