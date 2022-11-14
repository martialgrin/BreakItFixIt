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
		const container = document.getElementById("stage");
		scale = event.detail.scale;
		x = mapPos(event.detail.x, container.clientWidth);
		y = mapPos(event.detail.y, container.clientHeight);
		firebase.setValues(
			{ x: x, y: y, state: true },
			"poster" + $page.url.pathname.slice(1)
		);
	}
	// create a manager for that element
</script>

<!-- <p>Current URL: {$page.url.pathname}</p> -->
<div id="container">
	<div use:pan={{ delay: 0 }} on:pan={handler} id="stage">
		multi touch center: x {x}, y {y}
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
		background-color: #aea;
		border: #6b6 1em solid;
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
	}
</style>
