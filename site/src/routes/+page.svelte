<script lang="ts" context="module">
  import image from "$lib/assets/jambionnat-256.png";
  import { BattleRoyaleVictoryType, MarblesVictoryType } from "$lib/types";
  import type { PageServerData } from ".svelte-kit/types/src/routes/$types";

  type Player = {
    name: string;
    display_name: string;
    marbles: number;
    points: number;
  };
</script>

<script lang="ts">
  export let data: PageServerData;

  export let events = data.events;

  export let leaderboard: Player[] = Array.from(
    events
      ?.reduce((acc, { type, name, display_name }) => {
        const isMarble = type === MarblesVictoryType;
        const { points, marbles } = acc.get(name) ?? { points: 0, marbles: 0 };
        return acc.set(name, {
          name,
          display_name,
          marbles: marbles + (isMarble ? 1 : 0),
          points: points + (isMarble ? 5 : 1),
        });
      }, new Map<string, Player>())
      .values()
  ).sort(
    (a, b) =>
      b.points - a.points || a.display_name.localeCompare(b.display_name)
  );
</script>

<svelte:head>
  <title>Stream Avatar Leaderboard</title>
</svelte:head>

<main class="container">
  <img class="image" src={image} alt="" />
  <h1 class="title">Stream Avatar Leaderboard</h1>

  <div class="podium">
    <div class="left">
      <a href="https://www.twitch.tv/{leaderboard[0].name}"
        >{leaderboard[0].display_name}</a
      >
      <div class="content" />
    </div>
    <p class="top">
      <a href="https://www.twitch.tv/{leaderboard[1].name}"
        >{leaderboard[1].display_name}</a
      >
      <span class="content" />
    </p>

    <div class="right">
      <a href="https://www.twitch.tv/{leaderboard[1].name}"
        >{leaderboard[1].display_name}</a
      >
      <div class="content" />
    </div>
  </div>

  <ol start="4">
    {#each leaderboard.slice(3) as { name, display_name, marbles, points }}
      <li class="player">
        <a href="https://www.twitch.tv/{name}">{display_name}</a>:
        {points}
        {#if marbles}
          <span class="marbles">🌕</span>
        {/if}
      </li>
    {/each}
  </ol>
  <br />
  Nombre de battles royale : {events
    .filter(({ type }) => type === BattleRoyaleVictoryType)
    .reduce((count) => count + 1, 0)}
</main>

<style>
  .container {
    margin: 0 var(--container-mx);
    max-width: var(--container-max-w);

    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image {
    max-width: 100%;
  }

  .marbles {
    font-size: 0.875rem;
    margin-left: 0.25rem;
  }

  .player {
    margin: 0.25rem 0;
  }

  .title {
    text-align: center;
  }

  .podium {
    display: flex;
    align-items: end;
  }

  .podium div {
    /*width: 3rem;*/
    display: inline-block;
  }

  .podium .top {
    /*background: rgb(39, 44, 56);*/
    background: yellow;
  }
  .podium .top .content {
    height: 3rem;
  }

  .podium .left {
    background: orange;
  }
  .podium .left .content {
    height: 2rem;
  }

  .podium .right {
    background: red;
  }
  .podium .right .content {
    height: 1rem;
  }
</style>
