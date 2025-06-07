import Player from "./Player.mjs";

const socket = io();
const canvas = document.getElementById("game-window");
const context = canvas.getContext("2d");
const rectPosition = {
  start: [10, 70],
  size: [canvas.width - 20, canvas.height - 80],
};
let player;
const drawPlayer = (player) => {
  const path2Color = `#${player.color}`; // Custom color for outline
  const path1Color = "#FFFF"; // Custom color for face  
  let svgString = `
      <svg 
 xmlns="http://www.w3.org/2000/svg"
 xmlns:xlink="http://www.w3.org/1999/xlink"
 width="509px" height="451px">
<path fill-rule="evenodd"  fill="${path1Color}"
 d="M354.446,61.998 C354.446,61.998 306.366,40.712 257.313,40.712 C206.938,40.712 155.554,61.998 155.554,61.998 C155.554,61.998 122.419,74.067 99.458,96.137 C68.948,128.626 61.196,152.695 61.196,152.695 C61.196,152.695 29.564,208.356 33.444,270.231 C33.748,323.312 75.500,374.516 118.551,393.321 C181.788,420.943 248.062,422.011 248.062,422.011 C248.062,422.011 399.823,426.720 453.430,341.494 C507.315,270.503 452.585,153.876 451.580,151.770 C430.031,94.693 354.446,61.998 354.446,61.998 Z"/>
<path fill-rule="evenodd"  fill="${path2Color}"
d="M479.804,141.194 C479.804,141.194 543.684,277.218 481.925,358.546 C420.485,456.183 246.548,450.788 246.548,450.788 C246.548,450.788 170.589,449.565 98.112,417.921 C48.770,396.377 0.918,337.717 0.569,276.906 C-3.878,206.021 32.376,142.254 32.376,142.254 C32.376,142.254 -35.847,95.759 31.316,22.445 C94.544,-34.514 140.522,38.349 140.522,38.349 C140.522,38.349 199.414,13.963 257.151,13.963 C313.372,13.963 368.478,38.349 368.478,38.349 C368.478,38.349 426.404,-40.545 488.286,31.987 C538.708,101.716 479.804,141.194 479.804,141.194 ZM451.580,151.770 C430.031,94.693 354.446,61.998 354.446,61.998 C354.446,61.998 306.366,40.712 257.313,40.712 C206.938,40.712 155.554,61.998 155.554,61.998 C155.554,61.998 122.419,74.067 99.458,96.137 C68.948,128.626 61.196,152.695 61.196,152.695 C61.196,152.695 29.564,208.356 33.444,270.231 C33.748,323.312 75.500,374.516 118.551,393.321 C181.788,420.943 248.062,422.011 248.062,422.011 C248.062,422.011 399.823,426.720 453.430,341.494 C507.315,270.503 452.585,153.876 451.580,151.770 ZM402.934,285.216 C387.462,296.207 365.583,296.869 346.013,287.210 C327.392,278.008 311.761,264.491 301.076,247.340 C291.970,232.727 288.514,218.439 288.094,210.461 C287.258,194.588 290.947,181.563 298.307,171.998 C301.431,167.937 305.588,164.003 311.112,160.392 C317.262,156.372 325.086,153.190 335.028,151.654 C342.072,150.566 350.029,150.725 358.995,152.651 C368.432,154.678 378.317,158.911 387.1000,165.1000 C403.994,177.709 421.633,199.977 422.906,230.396 C423.614,247.288 420.674,272.615 402.934,285.216 ZM329.000,174.1000 C315.747,175.744 304.985,186.965 304.898,200.300 C304.806,214.397 316.674,226.307 330.1000,226.000 C344.949,225.701 356.265,213.926 356.000,199.1000 C355.726,185.577 343.134,174.207 329.000,174.1000 ZM298.000,264.000 C295.437,281.387 269.730,290.815 265.1000,296.000 C265.754,296.342 265.974,295.735 265.1000,300.000 C269.834,304.388 281.725,314.286 294.1000,318.000 C315.509,318.481 314.288,318.127 336.000,313.000 C348.507,320.440 340.098,328.532 339.1000,329.000 C339.353,332.086 312.478,340.485 290.000,335.000 C272.377,330.148 258.674,318.568 256.1000,317.000 C256.488,316.520 237.701,333.572 219.1000,336.000 C166.312,337.466 172.119,324.034 171.000,323.000 C170.495,322.533 170.790,313.567 178.000,313.000 C187.636,314.460 200.784,321.591 216.000,317.000 C228.905,316.029 241.940,305.176 246.1000,301.000 C247.528,297.105 246.996,295.279 246.1000,295.000 C246.1000,295.000 220.415,279.096 216.000,268.000 C214.065,256.271 216.820,239.131 256.1000,240.000 C288.247,239.895 298.084,248.239 298.000,264.000 ZM210.1000,248.000 C200.299,265.207 184.647,278.768 165.1000,288.000 C146.403,297.691 124.493,297.026 108.1000,286.000 C95.271,276.230 87.951,258.587 88.1000,231.000 C90.024,204.063 104.227,180.102 123.615,166.130 C132.783,159.523 142.887,155.121 153.000,152.1000 C162.634,150.979 170.483,150.991 177.000,151.1000 C189.870,153.992 204.393,160.084 213.773,172.411 C220.420,181.147 224.920,193.492 224.000,210.1000 C223.579,219.004 220.118,233.338 210.1000,248.000 ZM178.000,175.1000 C164.747,176.744 153.985,187.965 153.898,201.300 C153.806,215.397 165.674,227.307 180.000,227.000 C193.949,226.701 205.265,214.926 205.000,200.1000 C204.726,186.577 192.134,175.207 178.000,175.1000 Z"/>
</svg>`;

  const img = new Image();
  img.src = "data:image/svg+xml;utf8," + encodeURIComponent(svgString);
  context.drawImage(img, player.x, player.y, 40, 40);
};
const drawCollectible = (collectible) => {
  context.beginPath();
  context.arc(
    collectible.collectible.x,
    collectible.collectible.y,
    10,
    0,
    2 * Math.PI
  );
  context.fillStyle = `#${collectible.color}`;
  context.fill();
  context.closePath();
};

const drawRank = (rank) => {
  context.clearRect(canvas.width - 120, 10, 100, 40);
  context.fillStyle = "white";
  context.font = '0.8em "Press Start 2P"';
  context.fillText(rank, canvas.width - 100, 40);
};

const clearField = () => {
  context.clearRect(...rectPosition.start, ...rectPosition.size);
};
// State
let rank;
let collectible;
let players;
let pressedKeys = {};
//
const movePlayer = (direction) => {
  // const boundary = 16;
  let moved = false;
  if (direction === "up" && player.y >= rectPosition.start[1] + 3) {
    moved = true;
  }
  if (direction === "left" && player.x >= rectPosition.start[0] + 3) {
    moved = true;
  }
  if (
    direction === "down" &&
    player.y <= rectPosition.size[1] + rectPosition.start[1] - 43
  ) {
    moved = true;
  }
  if (
    direction === "right" &&
    player.x <= rectPosition.size[0] + rectPosition.start[0] - 43
  ) {
    moved = true;
  }

  if (moved) {
    player.movePlayer(direction, 5);
    if (player.collision(collectible.collectible))
      socket.emit("request-collectible");
    socket.emit("update-player", player);
  }
};

// Rendering
const gameLoop = () => {
  if (pressedKeys.w) movePlayer("up");
  if (pressedKeys.a) movePlayer("left");
  if (pressedKeys.s) movePlayer("down");
  if (pressedKeys.d) movePlayer("right");

  // Field Rendering
  // if (updateField) {
  clearField();
  // rank
  if (rank) {
    drawRank(rank);
    rank = undefined;
  }

  // Collectible
  if (collectible) drawCollectible(collectible);
  // Players
  if (players)
    players.forEach((player) => {
      drawPlayer(player);
    });
  // updateField = false;
  // }

  window.requestAnimationFrame(gameLoop);
};
socket.on("connect", () => {
  // Context Header
  context.font = '0.8em "Press Start 2P"';
  context.fillStyle = "white";
  context.fillText("Controls:WASD", 10, 40);
  context.textAlign = "center";
  context.fillText("Coin Race", canvas.width / 2, 40);
  // Game Field
  context.strokeStyle = "white";
  context.lineWidth = 2;
  context.strokeRect(...rectPosition.start, ...rectPosition.size);
  // new Player
  player = new Player({
    x:
      Math.floor(Math.random() * (rectPosition.size[0] - 43)) +
      rectPosition.start[0] +
      10,
    y:
      Math.floor(Math.random() * (rectPosition.size[1] - 43)) +
      rectPosition.start[1] +
      10,
    score: 0,
    id: socket.id,
  });
  socket.emit("new-player", player);
  // Collectible
  window.requestAnimationFrame(gameLoop);
});

// Collectible Spawn
socket.on("new-collectible", (collect) => {
  collectible = collect;
  // updateField = true;
});
// Get Players
socket.on("update-players", (arr) => {
  rank = player.calculateRank(arr);
  players = arr;
  // updateField = true;
});

// KeyboardListener
window.addEventListener("keydown", (e) => {
  if (["w", "a", "s", "d"].includes(e.key.toLocaleLowerCase())) {
    e.preventDefault();
    pressedKeys[e.key] = true;
  }
});
window.addEventListener("keyup", (e) => {
  if (["w", "a", "s", "d"].includes(e.key.toLocaleLowerCase())) {
    e.preventDefault();
    pressedKeys[e.key] = false;
  }
});
