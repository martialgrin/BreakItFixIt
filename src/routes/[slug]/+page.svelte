<script>
	("use strict");
	import {
		setPointerControls,
		getCenterOfTwoPoints,
		pan,
	} from "svelte-gestures";
	import { firebaseConfig } from "../../firebaseConfig";
	import { page } from "$app/stores";

	import { mapPos, shuffleArray } from "./../../utils";
	import Header from "../Header.svelte";
	let isPage = false;
	if ($page.url.pathname != "/") {
		isPage = true;
	}

	const firebase = firebaseConfig();

	//const portsCount = 8;
	//const ports = [...Array(portsCount)].map((_, i) => 5783 + i);
	const portsA = [8001, 8002, 8003, 8004, 8005, 8006, 8007, 8008];
	const portsB = [8009, 8010, 8011, 8012, 8014, 8015, 8016];
	let ports = [];
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
	let posA = 0;
	let posB = 0;

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
		//console.log(event);
		const container = document.getElementById("stage");
		canvasX = posX;
		canvasY = posY;
		x = mapPos(posX, container.clientWidth);
		y = mapPos(posY, container.clientHeight);
		firebase.setValues(
			{ x: x, y: y, state: state, ports: { 0: portsA[posA], 1: portsB[posB] } },
			"poster" + $page.url.pathname.slice(1)
		);
	}

	//   setInterval(() => {
	//     changePorts();
	//   }, 10000);

	function changePorts(e) {
		console.log(e);
		const a = portsA.slice();
		const b = portsB.slice();

		shuffleArray(a);
		shuffleArray(b);

		console.log(ports);

		if (posA < portsA.length - 1) {
			posA++;
		} else {
			posA = 0;
		}
		if (posB < portsB.length - 1) {
			posB++;
		} else {
			posB = 0;
		}

		firebase.setValues(
			{ x: x, y: y, state: false, ports: { 0: portsA[posA], 1: portsB[posB] } },
			"poster" + $page.url.pathname.slice(1)
		);
	}

	// create a manager for that element
</script>

<!-- <p>Current URL: {$page.url.pathname}</p> -->
<div id="infos-container">
	<button id="button" on:click={changePorts}>
		<!-- <p>button</p> -->
		<svg
			width="30"
			height="30"
			viewBox="0 0 60 59"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<path
				d="M0.137659 12.7889C0.411907 13.4374 1.05518 13.8618 1.76904 13.8618H58.232C59.206 13.8618 59.9965 13.0844 59.9965 12.1265C59.9965 11.1685 59.206 10.3911 58.232 10.3911H6.02796L13.6001 2.94198C14.2695 2.26172 14.2595 1.17886 13.5779 0.508521C12.8963 -0.161821 11.7973 -0.169754 11.1036 0.486705L0.518784 10.9008C0.0126334 11.3966 -0.138607 12.1423 0.133626 12.7928H0.137659V12.7889Z"
				fill="white"
			/>
			<path
				d="M59.8634 46.1711C59.5892 45.5226 58.9459 45.0981 58.232 45.0981H1.76905C0.79506 45.0981 0.00457764 45.8756 0.00457764 46.8335C0.00457764 47.7914 0.79506 48.5688 1.76905 48.5688H53.9731L46.401 56.016C46.0602 56.3393 45.8666 56.7835 45.8626 57.2496C45.8586 57.7156 46.0441 58.1619 46.3788 58.4911C46.7136 58.8203 47.1673 59.0028 47.6412 58.9988C48.1151 58.9948 48.5668 58.8045 48.8955 58.4693L59.4823 48.0572C59.9884 47.5614 60.1397 46.8156 59.8675 46.1651L59.8634 46.1691V46.1711Z"
				fill="white"
			/>
		</svg>
	</button>

	<div id="infos">
		<p>
			x: {x} <br />
			y: {y}<br />
			{currentState ? "is pressed" : "press it"}
		</p>
	</div>
</div>
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
	/>
</div>

<style>
	#infos {
		color: white;
	}
	#container {
		background-color: black;
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
		background-color: white;
		color: black;
		box-shadow: rgba(17, 17, 26, 0.1) 0px 8px 24px,
			rgba(17, 17, 26, 0.1) 0px 16px 56px, rgba(17, 17, 26, 0.1) 0px 24px 80px;
		box-sizing: border-box;
		/* border: 1px solid black; */
		width: calc(95vh / 1.77);
		height: 95vh;
		display: flex;
		justify-content: center;
		align-items: center;
	}
	#infos-container {
		position: absolute;
		z-index: 10000;
		top: 1rem;
		left: 1rem;
		padding: 0.5rem;
	}
	#button {
		background: none;
		color: inherit;
		border: none;
		padding: 0;
		font: inherit;
		cursor: pointer;
		outline: inherit;
	}
	#button:focus {
		transform: scale(2);
	}
</style>
