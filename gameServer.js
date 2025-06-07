const players = new Map();
const Collectible = require("./public/Collectible.mjs");

const collectibleHandler = () => {
  let color;
  do {
    color = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
  } while (color === "000000");
  const collectible = new Collectible({
    x: Math.floor(Math.random() * (640 - 40)) + 20,
    y: Math.floor(Math.random() * (480 - 100)) + 80,
    value: 10,
    id: Math.random().toString(36).substring(2, 15),
  });
  return { collectible, color };
};

module.exports = function (io) {
  // Collectible
  let collectible = new collectibleHandler();
  
  
  io.on("connection", (socket) => {
    socket.emit('new-collectible',collectible);
    // newPlayer
    socket.on("new-player", (player) => {
      players.set(socket.id, player);
      io.emit("update-players", Array.from(players.values()));
    })    
    // disconnect
    socket.on("disconnect", () => {
      players.delete(socket.id);
      socket.broadcast.emit("update-players",Array.from(players.values()));
    })
    // collectible request
    socket.on('request-collectible',()=>{
      collectible = collectibleHandler();
      socket.emit('new-collectible',collectible);
    })    
    // updatePlayer
    socket.on("update-player", (player) => {
      io.emit('new-collectible',collectible);
      players.set(socket.id, player);
      io.emit("update-players", Array.from(players.values()));
    });
    // Move
    // Catch Collectible
    // update Rank
  });
};
