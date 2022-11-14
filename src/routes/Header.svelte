<script>
	import { page } from "$app/stores";
	let isPage = false;
	if ($page.url.pathname != "/") {
		isPage = true;
	}
</script>

<header>
	{#if isPage}
		<p>{$page.url.pathname.slice(1)}</p>
	{/if}
</header>
