<script lang="ts" context="module">
  import image from "$lib/assets/jambionnat-256.png";
</script>

<script lang="ts">
  import type { PageServerData } from ".svelte-kit/types/src/routes/$types";

  export let data: PageServerData;

  export let leaderboard = Array.from(
    data?.victories
      ?.reduce((acc, { name, display_name }) => {
        const { victories } = acc.get(name) ?? { victories: 0 };
        return acc.set(name, { name, display_name, victories: victories + 1 });
      }, new Map<string, { name: string; display_name: string; victories: number }>())
      .values()
  ).sort(
    (a, b) =>
      b.victories - a.victories || a.display_name.localeCompare(b.display_name)
  );
</script>

<svelte:head>
  <title>Stream Avatar Leaderboard</title>
</svelte:head>

<main class="container">
  <img class="image" src={image} alt="" />
  <h1 class="title">Stream Avatar Leaderboard</h1>

  <ol>
    {#each leaderboard as { name, display_name, victories }}
      <li>
        <a href="https://www.twitch.tv/{name}">{display_name}</a>: {victories}
      </li>
    {/each}
  </ol>
</main>

<style>
  .container {
    margin: 0 var(--container-mx);
    max-width: var(--container-max-w);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .title {
    text-align: center;
  }

  .image {
    max-width: 100%;
  }
</style>
