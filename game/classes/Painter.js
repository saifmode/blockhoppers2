import { config } from "../game.js";
import { c } from "../game.js";
import { canvas } from "../game.js"
import { gameBoard } from "../game.js";
import { homeAddresses } from "../game.js";
import { mouse } from "../eventListeners.js";
import { mousedown } from "../eventListeners.js";
import { hoppers } from "../game.js";

// During init() we log all movable blocks and create an array of objects that stores the block's home address
// and current address. Initially home and current are the same.
// When user first drags a block, its home address is stored in this selector object.
// Then when user drags the block to another location, we search the 'addresses' array
// for an object that matches the home address stored in this selector.
// Its new location is then stored in 'current'.
// The implication of this is that when the user goes to drag the block again, we loop through this process
// Only this time, the current address is different to the home address.
// The home address is referenced when dragging the block around, so that we can't pull the block
// more than one square away in any direction.
// Doing things this way means we don't have to have an object for every block, which
// gives primacy to the level map.
// This makes life easier when it comes to being able to edit levels etc.
// We also don't have to loop through a list of block objects every frame, because collisions are handled by
// the hopper object which only checks for collisions within one square of itself,
// and the loops in this object are only called when we drag a block.

export default class Painter {
	constructor() {
		this.x = null;
		this.y = null;
		this.homeX = null;
		this.homeY = null;
		this.dragging = false;
		this.draggingBlock = false;
		this.whatBlockWas = null;
	}

	update() {
		let gridX = Math.floor(mouse.x / config.board.spacing);
		let gridY = Math.floor(mouse.y / config.board.spacing);
		let newX = Math.floor(this.x / config.board.spacing);
		let newY = Math.floor(this.y / config.board.spacing);

		// Helper functions
		let isOverlappingBlock = () => {
			try {
				return [1,2,3,4].includes(gameBoard[gridY][gridX]);
			} catch {
				return false;
			}
		};

		let hasStartedDraggingBlock = () =>
			!this.dragging && mousedown && isOverlappingBlock();
		let isDraggingEmptySquare = () =>
			!this.dragging && mousedown && !isOverlappingBlock();
		let hasStoppedDragging = () => this.draggingBlock && !mousedown;
		let isPainting = () => mousedown && this.draggingBlock;
		let squareIsEmpty = () => {
			try {
				return gameBoard[gridY][gridX] == 0;
			} catch {
				return false;
			}
		};
		let isOverlappingHopper = () =>
			hoppers.some(hopper => {
				try {
					let hopperGridX = Math.floor(
						hopper.x / config.board.spacing
					);
					let hopperGridY = Math.floor(
						hopper.y / config.board.spacing
					);
					return newX == hopperGridX && newY == hopperGridY;
				} catch {
					return false;
				}
			});

		if (hasStartedDraggingBlock()) {
			let address = homeAddresses.filter(
				address =>
					address.current.x == gridX && address.current.y == gridY
			)[0];
			this.whatBlockWas = gameBoard[gridY][gridX];
			if (this.whatBlockWas == 1) {
			this.homeX = address.home.x * config.board.spacing;
			this.homeY = address.home.y * config.board.spacing;
			}
			this.dragging = true;
			this.draggingBlock = true;
			gameBoard[gridY][gridX] = 0;
		} else if (isDraggingEmptySquare()) {
			console.log("empty boi")
			this.dragging = false;
			this.draggingBlock = false;
		}

		if (isOverlappingHopper() && this.dragging) {
			this.draw();
			return;
		} else if (hasStoppedDragging()) {
			let oldHomeX;
			let oldHomeY;
			homeAddresses.forEach(address => {
				if (
					address.home.x ==
						Math.floor(this.homeX / config.board.spacing) &&
					address.home.y ==
						Math.floor(this.homeY / config.board.spacing)
				) {
					oldHomeX = address.home.x;
					oldHomeY = address.home.y;
					address.home.x = newX; // set new home if edit mode
					address.home.y = newY;
					address.current.x = newX;
					address.current.y = newY;
				}
			});
			gameBoard[newY][newX] = this.whatBlockWas;
			// if (this.whatBlockWas == 1) {
			// 	gameBoard[oldHomeY][oldHomeX] = 0;
			// }
			

			this.dragging = false;
			if (this.draggingBlock) {
				c.fillStyle = config.colors.list[this.whatBlockWas];
				c.fillRect(
					this.x,
					this.y,
					config.board.spacing,
					config.board.spacing
				);
			}
			this.draggingBlock = false;
		} else if (
			isPainting() &&
			squareIsEmpty() &&
			// mouse.x < this.homeX + config.board.spacing * 2 && // Skip these if you want to drag the block anywhere, e.g. during level editing.
			// mouse.x > this.homeX - config.board.spacing && 
			// mouse.y < this.homeY + config.board.spacing * 2 &&
			// mouse.y > this.homeY - config.board.spacing &&
			mouse.x < canvas.width &&
			mouse.x >= 0 &&
			mouse.y < canvas.height &&
			mouse.y >= 0
		) {
			this.x =
				Math.floor(mouse.x / config.board.spacing) *
				config.board.spacing;
			this.y =
				Math.floor(mouse.y / config.board.spacing) *
				config.board.spacing;
		}


		if (isPainting()) {
			this.draw();
		}
	}

	draw() {
		c.save();
		c.beginPath();
		c.strokeStyle = "white";
		c.shadowColor = "white";
		c.shadowBlur = 12;
		c.fillStyle = config.colors.list[this.whatBlockWas];
		c.rect(this.x, this.y, config.board.spacing, config.board.spacing);
		c.fillRect(this.x, this.y, config.board.spacing, config.board.spacing);
		c.stroke();
		c.closePath();
		c.restore();
	}
}