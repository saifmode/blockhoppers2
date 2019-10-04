export const mouse = { x: 900, y: 900 };
export let mousedown = false;

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
