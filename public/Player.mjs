class Player {
  constructor({ x, y, score, id }) {
    this.x = x;
    this.y = y;
    this.score = score;
    this.id = id;
    // Generate a random color, but avoid pure black ("000000")
    let color;
    do {
      color = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    } while (color === "000000");
    this.color = color;
  }

  movePlayer(dir, speed) {
    switch (dir) {
      case "up":
        this.y -= speed;
        break;
      case "down":
        this.y += speed;
        break;
      case "left":
        this.x -= speed;
        break;
      case "right":
        this.x += speed;
        break;
      default:
        console.error("Invalid direction");
    }
  }

  collision(item) {
    // This player is a square (use inscribed circle, radius 20, center at x+20, y+20)
    // Item is a circle with radius 10, center at item.x, item.y
    const thisCenterX = this.x + 20;
    const thisCenterY = this.y + 20;
    const itemCenterX = item.x;
    const itemCenterY = item.y;
    const dx = thisCenterX - itemCenterX;
    const dy = thisCenterY - itemCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radiusSum = 20 + 10; // player inscribed circle + item circle

    if (distance <= radiusSum) {
      this.score += item.value;
      return true;
    }
    return false;
  }

  calculateRank(arr) {
    let rank = 1;
    arr
      .sort((a, b) => b.score - a.score)
      .find((player, index) => {
        if (player.id === this.id) rank = index + 1;
      });
    return `Rank: ${rank}/${arr.length}`;
  }
}

export default Player;
