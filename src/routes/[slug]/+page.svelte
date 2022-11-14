<script>
	("use strict");
	import {
		setPointerControls,
		getCenterOfTwoPoints,
		pan,
	} from "svelte-gestures";
	import { firebaseConfig } from "../../firebaseConfig";
	import { page } from "$app/stores";
	let isPage = false;
	if ($page.url.pathname != "/") {
		isPage = true;
	}

	const firebase = firebaseConfig();

	firebase.initValues();

	export function multiTouch(node, parameters = { touchCount: 1 }) {
		const gestureName = "multiTouch";
		let touchCenter;

		function onUp(activeEvents) {
			if (activeEvents.length < parameters.touchCount) {
				let distance = null;
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
		x = event.detail.x;
		y = event.detail.y;
		firebase.setValues(
			{ x: x, y: y, state: true },
			"poster" + $page.url.pathname.slice(1)
		);
	}
	// create a manager for that element
</script>

<!-- <p>Current URL: {$page.url.pathname}</p> -->
<div
	use:pan={{ delay: 300 }}
	on:pan={handler}
	use:multiTouch={{ touchCount: 2 }}
	on:multiTouch={handler}
	id="stage"
>
	multi touch center: x {x}, y {y}
</div>

<style>
	#stage {
		box-sizing: border-box;
		border: 1px solid black;
		width: 100vw;
		height: calc(100vw * 1.77);
	}
</style>
