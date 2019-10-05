import Hopper from "./classes/Hopper.js";
import Selector from "./classes/Selector.js";
import Painter from "./classes/Painter.js";
import {debugPanel} from "./eventListeners";

export const config = {
	board: {
		size: 16,
		spacing: 32
	},

	hopper: {
		color: "green",
		radius: 9
	},

	mode: "random",

	physics: {
		gravity: 0.3,
		speed: 1.5,
		terminal: 9.8
	},

	colors: {
		empty: "black",
		movable: "pink",
		immovable: "grey",
		exit: "white",
		spawn: "blue",
	}
};
config.colors.list = [config.colors.empty, config.colors.movable, config.colors.immovable, config.colors.spawn, config.colors.exit]

export const canvas = document.querySelector("canvas");
export const c = canvas.getContext("2d");
canvas.width = config.board.size * config.board.spacing;
canvas.height = config.board.size * config.board.spacing;

export const level = {
	color: "pink"
};

export let homeAddresses = [];
export const gameBoard = [
	[0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[2, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[2, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 2, 1, 2, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 1, 0, 1, 0, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 0, 0, 0],
	[0, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 1, 0, 0],
	[0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] // <- stops falling errors occuring
];

export let hoppers = [];
export const selector = new Selector();
export const painter = new Painter();
function init() {
	debugPanel.innerHTML = "Playing level"
	hoppers = [];
	hoppers.push(new Hopper(48, 0));

	for (let y = 0; y < config.board.size; y++) {
		for (let x = 0; x < config.board.size; x++) {
			if (gameBoard[y][x] == 1) {
				homeAddresses.push({
					home: { x: x, y: y },
					current: { x: x, y: y }
				});
			}
		}
	}
}

function gameLoop() {
	requestAnimationFrame(gameLoop);

	c.fillStyle = "black";
	c.fillRect(0, 0, canvas.width, canvas.height);
	c.fill();

	// Draw game board
	for (let y = 0; y < config.board.size; y++) {
		for (let x = 0; x < config.board.size; x++) {
			switch (gameBoard[y][x]) {
				case 0:
					c.fillStyle = config.colors.empty;
					break;
				case 1:
					c.fillStyle = config.colors.movable;
					break;
				case 2:
					c.fillStyle = config.colors.immovable;
					break;
				case 3:
					c.fillStyle = config.colors.spawn;
					break;
				case 4:
					c.fillStyle = config.colors.exit;
					break;
			}
			c.save();
			c.beginPath();
			c.fillRect(
				x * config.board.spacing,
				y * config.board.spacing,
				x * config.board.spacing + config.board.spacing,
				y * config.board.spacing + config.board.spacing
			);
			c.fill();
			c.closePath();
			c.restore();
		}
	}
	// Update and draw selector
	if (config.mode == "editor") {
		painter.update();
	} else {
		selector.update();
	}

	// Update and draw hoppers
	hoppers.forEach(hopper => hopper.update());
}

init();
gameLoop();
