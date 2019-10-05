import { config } from "../game.js";
import { c } from "../game.js";
import { canvas } from "../game.js";
import { gameBoard } from "../game.js";
import { homeAddresses } from "../game.js";
import { mouse } from "../eventListeners.js";
import { mousedown } from "../eventListeners.js";
import { hoppers } from "../game.js";

export default class Dragger {
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
		let mouseGridX = Math.floor(mouse.x / config.board.spacing);
		let mouseGridY = Math.floor(mouse.y / config.board.spacing);
		let thisBlockX = Math.floor(this.x / config.board.spacing);
		let thisBlockY = Math.floor(this.y / config.board.spacing);
		let colorOfBlock = config.colors.list[this.whatBlockWas];

		// Helper functions
		const getHomeAddress = () => {
			let address = homeAddresses.filter(
				address =>
					address.current.x == mouseGridX &&
					address.current.y == mouseGridY
			)[0];
			this.homeX = address.home.x * config.board.spacing;
			this.homeY = address.home.y * config.board.spacing;};
		const setNewCurrentAddress = () => {
			console.log("Test");
			homeAddresses.forEach(address => {
				if (
					address.home.x ==
						Math.floor(this.homeX / config.board.spacing) &&
					address.home.y ==
						Math.floor(this.homeY / config.board.spacing)
				) {
					address.current.x = thisBlockX;
					address.current.y = thisBlockY;
				}
			});};
		const setHomeAddress = () => {
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
					address.home.x = thisBlockX; // set new home if edit mode
					address.home.y = thisBlockY;
					address.current.x = thisBlockX;
					address.current.y = thisBlockY;
				}
			});};
		const dropBlockOnEmptySquare = () => {
			this.dragging = false;
			if (this.whatBlockWas == 1) {
				setHomeAddress()
			}
			gameBoard[thisBlockY][thisBlockX] = this.whatBlockWas;
			if (this.draggingBlock) {
				c.fillStyle = "pink";
				c.fillRect(
					this.x,
					this.y,
					config.board.spacing,
					config.board.spacing
				);
			}
			this.draggingBlock = false;};
		const moveBlockToMousePosition = () => {
			this.x =
				Math.floor(mouse.x / config.board.spacing) *
				config.board.spacing;
			this.y =
				Math.floor(mouse.y / config.board.spacing) *
				config.board.spacing;
		};

		// Methods
		// Level 1
		// Skip mouseIsInHomeRange tests if you want to drag the block anywhere, e.g. during level editing.
		let mouseIsInHomeRange = () =>
			// mouse.x < this.homeX + config.board.spacing * 2 &&
			// mouse.x > this.homeX - config.board.spacing &&
			// mouse.y < this.homeY + config.board.spacing * 2 &&
			// mouse.y > this.homeY - config.board.spacing &&
			mouse.x < canvas.width &&
			mouse.x >= 0 &&
			mouse.y < canvas.height &&
			mouse.y >= 0;
		let mouseIsOverlappingBlock = () => {
			try {
				return [1, 2, 3, 4].includes(gameBoard[mouseGridY][mouseGridX]);
			} catch {
				return false;
			}
		};
		let hasStoppedDragging = () => this.dragging && !mousedown;
		let hasStoppedDraggingBlock = () => this.draggingBlock && !mousedown;
		let isDraggingBlock = () => this.draggingBlock && mousedown;
		let mouseOverlappingEmptySquare = () => {
			try {
				return gameBoard[mouseGridY][mouseGridX] == 0;
			} catch {
				return false;
			}
		};
		let blockOverlappingEmptySquare = () => {
			try {
				return gameBoard[thisBlockY][thisBlockX] == 0;
			} catch {
				return false;
			}
		};
		let mouseOverlappingHopper = () =>
			hoppers.some(hopper => {
				try {
					let hopperGridX = Math.floor(
						hopper.x / config.board.spacing
					);
					let hopperGridY = Math.floor(
						hopper.y / config.board.spacing
					);
					return (
						mouseGridX == hopperGridX && mouseGridY == hopperGridY
					); // change to new if bugs occur
				} catch {
					return false;
				}
			});
		let blockOverlappingHopper = () =>
			hoppers.some(hopper => {
				try {
					let hopperGridX = Math.floor(
						hopper.x / config.board.spacing
					);
					let hopperGridY = Math.floor(
						hopper.y / config.board.spacing
					);
					return (
						thisBlockX == hopperGridX && thisBlockY == hopperGridY
					);
				} catch {
					return false;
				}
			});

		// Level2
		let hasStartedDraggingBlock = () =>
			!this.draggingBlock && mousedown && mouseIsOverlappingBlock();
		let hasStartedDraggingNothing = () =>
			!this.dragging && mousedown && !mouseIsOverlappingBlock();
		let isDraggingBlockOverHopper = () =>
			blockOverlappingHopper() && isDraggingBlock();
		let hasDroppedBlockOnHopper = () =>
			hasStoppedDraggingBlock() &&
			mouseOverlappingHopper() &&
			!isDraggingBlockOverHopper();
		let isDraggingOverEmptySquare = () =>
			isDraggingBlock() &&
			mouseOverlappingEmptySquare() &&
			!mouseOverlappingHopper();
		let hasDroppedBlockOnEmptySquare = () =>
			hasStoppedDraggingBlock() &&
			!mouseOverlappingHopper() &&
			blockOverlappingEmptySquare() &&
			!blockOverlappingHopper();

		if (hasStartedDraggingBlock()) {
			this.whatBlockWas = gameBoard[mouseGridY][mouseGridX];
			if (this.whatBlockWas == 1) {
				getHomeAddress();
			}
			this.dragging = true;
			this.draggingBlock = true;
			gameBoard[mouseGridY][mouseGridX] = 0;
		} else if (hasStartedDraggingNothing()) {
			this.dragging = true;
			this.draggingBlock = false;
		}

		if (blockOverlappingHopper() && mouseOverlappingHopper()) {
			this.draw();
			return;
		} else if (
			blockOverlappingHopper() &&
			!mouseOverlappingHopper() &&
			mouseOverlappingEmptySquare() &&
			mouseIsInHomeRange()
		) {
			moveBlockToMousePosition();
		} else if (
			blockOverlappingHopper() &&
			(!mouseIsInHomeRange() || !mouseOverlappingEmptySquare())
		) {
			this.draw();
			return;
		}

		if (isDraggingOverEmptySquare() && mouseIsInHomeRange()) {
			moveBlockToMousePosition();
		} else if (
			hasDroppedBlockOnEmptySquare() ||
			hasDroppedBlockOnHopper()
		) {
			dropBlockOnEmptySquare();
		}

		if (isDraggingBlock()) {
			this.draw();
		}

		/*
		let mouseGridX = Math.floor(mouse.x / config.board.spacing);
		let mouseGridY = Math.floor(mouse.y / config.board.spacing);
		let thisBlockX = Math.floor(this.x / config.board.spacing);
		let thisBlockY = Math.floor(this.y / config.board.spacing);

		// Helper functions
		let isOverlappingBlock = () => {
			try {
				return [1, 2, 3, 4].includes(gameBoard[mouseGridY][mouseGridX]);
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
				return gameBoard[mouseGridY][mouseGridX] == 0;
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
					return mouseGridX == hopperGridX && mouseGridY == hopperGridY; // careful of bugs swapping grid and new
				} catch {
					return false;
				}
			});

		if (hasStartedDraggingBlock()) {
			let address = homeAddresses.filter(
				address =>
					address.current.x == mouseGridX && address.current.y == mouseGridY
			)[0];
			this.whatBlockWas = gameBoard[mouseGridY][mouseGridX];
			if (this.whatBlockWas == 1) {
				this.homeX = address.home.x * config.board.spacing;
				this.homeY = address.home.y * config.board.spacing;
			}
			this.dragging = true;
			this.draggingBlock = true;
			gameBoard[mouseGridY][mouseGridX] = 0;
		} else if (isDraggingEmptySquare()) {
			console.log("empty boi");
			this.dragging = false;
			this.draggingBlock = false;
		}

		if (isOverlappingHopper() && this.draggingBlock && mousedown) {
			this.draw();
			return;
		} else if (hasStoppedDragging() && isOverlappingHopper()) {
			this.draw();
			return;
		} else if (hasStoppedDragging() && !isOverlappingHopper()) {
			setHomeAddress();
			gameBoard[thisBlockY][thisBlockX] = this.whatBlockWas;
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
		*/
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
