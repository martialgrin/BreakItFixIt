<script>
	("use strict");
	import { setPointerControls, getCenterOfTwoPoints } from "svelte-gestures";

	export function multiTouch(node, parameters = { touchCount: 2 }) {
		const gestureName = "multiTouch";
		let touchCenter;

		function onUp(activeEvents) {
			if (activeEvents.length < parameters.touchCount) {
				distance = null;
			}
		}

		function onDown(activeEvents) {
			if (activeEvents.length === parameters.touchCount) {
				const activeEventsForLoop = [...activeEvents, activeEvents[0]];
				const coordsSum = activeEvents.reduce(
					(accu, activeEvent, index) => {
						touchCenter = getCenterOfTwoPoints(node, [
							activeEvent,
							activeEventsForLoop[index + 1],
						]);
						accu.x += touchCenter.x;
						accu.y += touchCenter.y;
						return accu;
					},
					{ x: 0, y: 0 }
				);

				const centerCoords = {
					x: Math.round(coordsSum.x / activeEvents.length),
					y: Math.round(coordsSum.y / activeEvents.length),
				};

				node.dispatchEvent(
					new CustomEvent(gestureName, {
						detail: { center: centerCoords, target: event.target },
					})
				);
			}
		}

		return setPointerControls(gestureName, node, null, onDown, onUp);
	}

	let scale;
	let x;
	let y;

	function handler(event) {
		scale = event.detail.scale;
		x = event.detail.center.x;
		y = event.detail.center.y;
	}
	// create a manager for that element
</script>

<!-- <p>Current URL: {$page.url.pathname}</p> -->
<div
	use:multiTouch={{ touchCount: 3 }}
	on:multiTouch={handler}
	style="width:500px;height:500px;border:1px solid black;"
>
	multi touch center: x {x}, y {y}
</div>

<style>
</style>
