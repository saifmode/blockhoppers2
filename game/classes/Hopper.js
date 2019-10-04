import { config } from "../game.js";
import { c } from "../game.js";
import { canvas } from "../game.js";
import { gameBoard } from "../game.js";

export default class Hopper {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.radius = config.hopper.radius;
		// Collision detectors
		this.left = x - this.radius;
		this.right = x + this.radius;
		this.bottom = y + this.radius;
		// Movement
		this.movement = "falling";
		this.direction = "right";
		// Physics
		this.dx = config.physics.speed;
		this.dy = config.physics.speed;
		this.terminal = config.terminal;
	}

	update() {
		// HELPER FUNCTIONS
		let isWallToLeft = () => block.includes(gameBoard[gridY][gridX - 1]);
		let isWallToRight = () => block.includes(gameBoard[gridY][gridX + 1]);
		let isFloorBelowHopper = () =>
			block.includes(gameBoard[gridY + 1][gridX]);
		let isNoFloorBelowHopper = () =>
			empty.includes(gameBoard[gridY + 1][gridX]);

		// COLLISIONS
		// First translate current px coordinates as grid coordinates
		let gridX = Math.floor(this.x / config.board.spacing);
		let gridY = Math.floor(this.y / config.board.spacing);

		let block = [1, 2]; // These correspond to blocks that hoppers can't move through
		let empty = [0, 4]; // Correspond to empty squares or exit

		let px_blockTop = (gridY + 1) * config.board.spacing; // y coordinate of top of block

		// Test collision with floor
		if (isFloorBelowHopper()) {
			// See if square below hopper is an impenetrable block
			if (this.bottom + this.dy > px_blockTop) {
				this.movement = "rolling";
				this.y = px_blockTop - this.radius; // Correcting position
			}
		}

		// Test collision with wall to the right of hopper
		if (isWallToRight()) {
			if (this.right > (gridX + 1) * config.board.spacing) {
				this.direction = "left";
			}
		}

		// Test collision with wall to the left of hopper
		if (isWallToLeft()) {
			if (this.left < gridX * config.board.spacing) {
				this.direction = "right";
			}
		}

		// Make hopper fall if it rolls off an edge
		if (
			this.movement == "rolling" &&
			isNoFloorBelowHopper() &&
			this.bottom + 1 > (gridY + 1) * config.board.spacing &&
			((this.left + 1 > gridX * config.board.spacing &&
				this.direction == "right") ||
				(this.right - 1 < (gridX + 1) * config.board.spacing &&
					this.direction == "left"))
		) {
			this.movement = "falling";
		}

		// Wrap around
		if (this.bottom + this.dy > canvas.height) {
			this.y = 0;
		}

		if (this.x > canvas.width) {
			this.x = 0;
		}

		if (this.x < 0) {
			this.x = canvas.width;
		}

		// MOVEMENT
		switch (this.movement) {
			case "falling":
				this.dx = 0;
				this.dy = Math.min(
					this.dy + config.physics.gravity,
					config.physics.terminal
				);
				this.y += this.dy;
				break;
			case "rolling":
				this.dx =
					this.direction == "right"
						? config.physics.speed
						: -config.physics.speed;
				this.dy = 0;
				this.x += this.dx;
				break;
		}

		// Update collision detectors
		this.left = this.x - this.radius;
		this.right = this.x + this.radius;
		this.bottom = this.y + this.radius;

		this.draw();
	}

	draw() {
		c.save();
		c.beginPath();
		c.fillStyle = config.hopper.color;
		c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
		c.fill();
		c.closePath();
		c.restore();
	}
}
