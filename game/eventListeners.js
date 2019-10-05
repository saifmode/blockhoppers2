export const mouse = { x: 900, y: 900 };
export let mousedown = false;

import { config } from "./game.js";
import { gameBoard } from "./game.js";
import { selector } from "./game.js";
import { painter } from "./game.js";

// MOUSE
window.addEventListener("mousemove", () => {
	mouse.x = event.x;
	mouse.y = event.y;
});

window.addEventListener("mousedown", () => {
	mousedown = true;
});
window.addEventListener("mouseup", () => {
	mousedown = false;
});

// KEYBOARD
export const debugPanel = document.getElementById("debug-panel");
export const btn_levelEditor = document.getElementById("level-editor");
export const btn_playLevel = document.getElementById("play-level");

btn_levelEditor.addEventListener("click", () => {
	debugPanel.innerHTML = "Editing level";
	painter.x = null;
	painter.y = null;
	painter.homeX = null;
	painter.homeY = null;
	painter.dragging = false;
	painter.draggingBlock = false;
	painter.whatBlockWas = null;
	config.mode = "editor";
});
btn_playLevel.addEventListener("click", () => {
	debugPanel.innerHTML = "Playing level";
	selector.x = null;
	selector.y = null;
	selector.homeX = null;
	selector.homeY = null;
	selector.dragging = false;
	selector.draggingBlock = false;
	selector.whatBlockWas = null;
	config.mode = "play";
});
