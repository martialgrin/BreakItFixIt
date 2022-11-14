<script>
	const numPosters = 15;
	let arrPosters = [];

	for (let i = 1; i < numPosters + 1; i++) {
		arrPosters.push(i);
	}
</script>

<div class="container">
	<h1>Choose your group poster</h1>
	<ul>
		{#each arrPosters as item}
			<li>
				<a href={"/" + item}>
					<div class="button">
						<p>Group {item}</p>
					</div>
				</a>
			</li>
		{/each}
	</ul>
</div>

<style>
	.container {
		min-height: 100vh;
		width: 100vw;
		display: flex;
		flex-direction: column;
	}

	.button {
		width: 100%;

		display: flex;
		justify-content: center;
	}

	ul {
		width: 100%;
		list-style: none;
		padding: 0;
	}

	li {
		width: 100%;
		border: 1px solid black;
		border-top: none;
		text-decoration: none;
	}
	li:nth-child(1) {
		border-top: 1px solid black;
	}
</style>
