<script lang="ts">
	import type { PageServerData } from '.svelte-kit/types/src/routes/$types';

	export let data: PageServerData;

	export let leaderboard = Array.from(
		data?.victories
			?.reduce<Map<string, { display_name: string; victories: number }>>(
				(acc, { name, display_name }) => {
					const { victories } = acc.get(name) ?? { victories: 0 };
					return acc.set(name, { display_name, victories: victories + 1 });
				},
				new Map<string, { display_name: string; victories: number }>()
			)
			.values()
	).sort((a, b) => b.victories - a.victories || a.display_name.localeCompare(b.display_name));
</script>

<svelte:head>
	<title>Stream Avatar Leaderboard</title>
</svelte:head>

<h1>Stream Avatar Leaderboard</h1>

<ol>
	{#each leaderboard as { display_name, victories }}
		<li>{display_name}: {victories}</li>
	{/each}
</ol>
