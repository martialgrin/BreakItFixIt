<script>
	("use strict");
	import {
		setPointerControls,
		getCenterOfTwoPoints,
		pan,
	} from "svelte-gestures";
	import { firebaseConfig } from "../../firebaseConfig";
	import { page } from "$app/stores";

	import { mapPos } from "./../../utils";
	import Header from "../Header.svelte";
	let isPage = false;
	if ($page.url.pathname != "/") {
		isPage = true;
	}

	const firebase = firebaseConfig();

	// firebase.initValues();

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
	let x = 0;
	let y = 0;
	let canvasX, canvasY;
	let currentState = false;

	function handler(event, state, type) {
		currentState = state;
		let posX, posY;
		if (type == "pan") {
			posX = event.detail.x;
			posY = event.detail.y;
		} else if (type == "touch") {
			if (state) {
				posX = event.touches[0].clientX;
				posY = event.touches[0].clientY;
			} else {
				posX = canvasX;
				posY = canvasY;
			}
		} else {
			if (state) {
				posX = event.clientX;
				posY = event.clientY;
			} else {
				posX = canvasX;
				posY = canvasY;
			}
		}
		console.log(event);
		const container = document.getElementById("stage");
		canvasX = posX;
		canvasY = posY;
		x = mapPos(posX, container.clientWidth);
		y = mapPos(posY, container.clientHeight);
		firebase.setValues(
			{ x: x, y: y, state: state },
			"poster" + $page.url.pathname.slice(1)
		);
	}
	// create a manager for that element
</script>

<!-- <p>Current URL: {$page.url.pathname}</p> -->
<div id="container">
	<div
		use:pan={{ delay: 0 }}
		on:pan={(e) => {
			handler(e, true, "pan");
		}}
		on:touchstart={(e) => {
			handler(e, true, "touch");
		}}
		on:touchend={(e) => {
			handler(e, false, "touch");
		}}
		on:mouseup={(e) => {
			handler(e, false, "simple");
		}}
		on:mousedown={(e) => {
			handler(e, true, "simple");
		}}
		id="stage"
	>
		{x}
		{y}
		{currentState}
	</div>
</div>

<style>
	#container {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		padding: 0;
		margin: 0;
		/* if you want the content to scroll normally: */
		overflow: auto;
		/* cosmetic stuff: */

		box-sizing: border-box;

		display: flex;
		justify-content: center;
		align-items: center;
	}
	#stage {
		box-sizing: border-box;
		border: 1px solid black;
		width: 90vw;
		height: calc(90vw * 1.77);
		display: flex;
		justify-content: center;
		align-items: center;
	}
</style>
