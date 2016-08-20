/* start make our screen */
let main = document.querySelector('.s');

for (let i = 0; i < 75; i++) {
  let node = document.createElement('div');
  node.classList.add('bar');
  main.appendChild(node);
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
let player = { x:30, y: 420, baseY: 420, baseTopDownY: 280, topDownY: 0, vx: 0, vy: 0, jumpHeight: 150, bAcross: 5, bDown: 9, bSize: 10 };

/**

  PLAYERS

**/

player.mainFrames = {
  across: 5,
  down: 9,
  current: 0,
  frames: [
    '00p0000r000rrr00rprp00r0000r000bbb00b0b0b0b00dtdt0'.split(''),
    '0000000p0000r000rrr00rprp00r000bbb00b0b0b0b00dtdt0'.split('')
  ]
}

player.walkFrames = {
  across: 5,
  down: 9,
  current: 0,
  frames: [
    '0000000p0000r000rrr00rprp00r000bbb0bb0b0d00b0t00dt'.split(''),
    '00p0000r000rrr00rprp00r0000r000bbb00b0b0b0b00dtdt0'.split('')
  ]
}

player.downFrames = {
  across: 5,
  down: 5,
  current: 0,
  frames: [
    '00rp000rd000p0000rd000rp0'.split(''),
  ]
}

player.downWalkFrames = {
  across: 5,
  down: 5,
  current: 0,
  frames: [
    '00rp000rd000p0000rd000rp0'.split(''),
    '00rp000rd000p0000rd000rp0'.split(''),
    '00rp000rd000p0000rd000rp0'.split('')
  ]
}

player.colours = {
  'r': 'a32e2e',
  'b': '2e6fa3',
  'p': '85655a',
  'd': '582828',
  't': '703c3c'
}

/**
  LEVEL STUFF
**/

//let sideLevel = {};
//let topDownLevel = {};
let levelBlock = (x, y, w, h) => { return { x, y, w, h } }

let sideLevel = [

  levelBlock(50, 520, 20, 20),
  levelBlock(70, 520, 60, 40),
  levelBlock(130, 520, 350, 20),
  levelBlock(480, 520, 40, 40),
  levelBlock(520, 520, 30, 30),
  levelBlock(550, 520, 20, 20),

  levelBlock(700, 520, 100, 20),
  levelBlock(800, 520, 120, 40),

  levelBlock(850, 520, 120, 40),
  levelBlock(950, 520, 100, 20) 
];

let sideWalls = [
  levelBlock(300, 320, 30, 200),
  levelBlock(770, 500, 30, 20)
];

let sideWallHanging = [

];

let topDownLevel = [
  levelBlock(50, 200, 500, 200),
  levelBlock(700, 200, 220, 200)
];
let topDownWalls = [
  levelBlock(300, 270, 30, 70),
  levelBlock(750, 200, 30, 200)
];

/* input */
let left = 37;
let space = 32;
let right = 39; 
let up = 38;
let down = 40;
let g = 71;
let lastKey;
let keySet = new Set();

document.addEventListener('keydown', (e) => {
  keySet.add(e.keyCode);
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

  if (e.keyCode === up && topDown === true) {
    player.topDownY-=5;
  }

  if (e.keyCode === down && topDown === true) {
    player.topDownY+=5;
  }

  if (e.keyCode === g) {
    topDown = (topDown === true) ? false : true;
  }
});

document.addEventListener('keyup', (e) => {
  keySet.delete(e.keyCode)

  if (keySet.has(left) === false && keySet.has(right) === false) {
    dir = 0;
  }
});


let cx = 0;
let lastTimestamp = null;
// refactor this silly thing
let lastTimestampTwo = null
let tick = false;

const render = (timestamp) => {

  crt();

  if (player.vy <= player.jumpHeight && player.jumping) {
    player.vy+=3
  } 

  if (player.vy >= player.jumpHeight && player.jumping) {
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


  /**

    COLLISION DETECTION

  **/
  let walls = (topDown === false) ? sideWalls : topDownWalls;
  
  // walls
  let hit = walls.some((wall) => {
    // need front and back
    // need to check y
    // 20px diff for top down view figure that out

    // Y - if the players top y is more wall top y or player bottom y is less than wall bottom y
    let downValue = topDown === false ? player.bDown : 5;
    let playerXPos = (player.bSize * player.bAcross) + (player.vx + player.x);
    let playerYPos = (player.bSize * downValue) + (player.vy + player.y);
    let wallXPos = (wall.x - wall.w);
    let wallYPos = (wall.y - wall.h);

    // top down y
    let currentPlayerY = (topDown === false) ? player.y : (player.baseTopDownY + player.topDownY);
    let wallYTop = wall.y;
    let wallYBottom = wall.y + wall.h;
    let playerYTop = (player.vy + currentPlayerY);
    let playerYBottom = (player.vy + currentPlayerY + ((player.bSize * downValue) ));

    let yCollision = (topDown === true) ? (playerYTop >= wallYTop && playerYBottom <= wallYBottom) : (playerYTop >= wallYTop || playerYBottom <= wallYBottom);
    
    if ( (playerXPos >= wallXPos && playerXPos <= wall.x) && yCollision) {
      console.log(wall);
      return true;
    }

    return false;
  });

  if (hit) {
    player.vx -=2;
    cx +=2;
  }

  /**

    CHECK PLAYER ON FLOOR

  **/

  // if player x is not over a wall then drop
  // get player width if any 
  // if they all return false we arent on the floor
  // currently looks a bit weird as there is a 10 pixel buffer due to the size of the frame (maybe minus 10 in the calc)
  let downValue = topDown === false ? player.bDown : 5;
  let playerYBottom = (player.y + ((player.bSize * downValue) ));

  let onFloor = sideLevel.some((floor) => {
    let playerStartX =  /*(player.bSize * player.bAcross) - */(player.vx + player.x);
    let playerEndX = (player.bSize * player.bAcross) + (player.vx + player.x);

    let floorStartX = floor.x;
    let floorEndX = floor.x + floor.w;
    let floorYBottom = floor.y;

    return (floorStartX <= playerEndX && playerStartX <= floorEndX);
  });

  let playerYBelowFloor = (playerYBottom + 10 + player.vy) <= 520;

  if (onFloor === false && playerYBelowFloor) {
    player.falling = true;
    player.jumping = false;
    player.vy-=20;
  }


  /**

    RENDER GRAPHICS

  **/

  context.save();
  context.setTransform(1, 0, 0, 1, 0, 0);
  context.clearRect(cx, 0, w + player.vx, h);
  // Restore the transform
  context.restore();

  context.translate(cx, 0);

  context.shadowBlur = 10;
  context.shadowColor = "#79ef7d";
  context.fillStyle = '#79ef7d';
 
  /**

    PLATFORMS

  **/

  if (topDown === false) {
    // paint all these as one?
    sideLevel.forEach((f) => { context.fillRect(f.x, f.y, f.w, f.h) });
  } else {
    topDownLevel.forEach((f) => { context.fillRect(f.x, f.y, f.w, f.h) });
  }

  /**

    WALLS

  **/

  context.shadowColor = "#55b958";
  context.fillStyle = '#55b958'

  let wallsToPaint = (topDown === false) ? sideWalls : topDownWalls;
  wallsToPaint.forEach((f) => { context.fillRect(f.x, f.y, f.w, f.h) });
  // the x for walls on top down should be approx 20px closer as our top down sprite is narrower MAYBE???

  context.shadowBlur = 0;

  /**

    PLAYER

  **/

  /**

    PLAYER FRAME

  **/

  var state;
  var frames;

  if (topDown === false) {
    if (dir === 0) {
      frames = player.mainFrames;
    } else {
      frames = player.walkFrames;
    }
  } else {
    if (dir === 0) {
      frames = player.downFrames;
    } else {
      frames = player.downWalkFrames;
    }
  }

  if (lastTimestampTwo === null || timestamp - lastTimestampTwo >= 500) {
    lastTimestampTwo = timestamp;
    frames.current = ( (frames.frames.length - 1) === frames.current) ? 0 : frames.current += 1;
  }

  state = frames.frames[frames.current];

  /**
    
    RENDER THE PLAYER

  **/


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
    let blockSize = player.bSize + (player.vy/20);

    startX = ((5 * blockSize) - blockSize);
    startX = (player.bDown * player.bSize) - player.x;
    startY = (player.baseTopDownY + player.topDownY);
    currentX = startX;
    currentY = startY;
    state.forEach((block, index) => {

      if (block !== '0') {
        context.fillStyle = '#'+player.colours[block];
        //context.fillRect( (currentX), currentY, blockSize, blockSize);
        context.fillRect( (currentX + player.vx), currentY - player.vy, blockSize, blockSize);
      }

      if ((index+1) % 5 === 0) {
        // new line
        currentX = startX;
        currentY += blockSize;
      } else {
        currentX += blockSize;
      }
    })
  }

  context.setTransform(1, 0, 0, 1, 0, 0);

  /**

    GLITCH EFFECT

  **/

  // glitch it
  //var screen = canvas.toDataURL();
  //console.log(screen);
  // get correct x,y based on transform etc
  // only do this every few frames
  if (tick === 'turnedoff') {
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