<script lang="ts" context="module">
  import image from "$lib/assets/jambionnat-256.png";
  import {
    BasketBallVictoryType,
    BattleRoyaleVictoryType,
    DuelVictoryType,
    MarblesVictoryType,
  } from "$lib/types";
  import type { PageServerData } from ".svelte-kit/types/src/routes/$types";

  type Player = {
    name: string;
    display_name: string;
    marbles: number;
    baskets: number;
    battles: number;
    duels: number;
  };
</script>

<script lang="ts">
  export let data: PageServerData;

  export let events = data.events;

  export const points = ({ battles, baskets, marbles, duels }: Player) =>
    battles + duels + 3 * baskets + 5 * marbles;

  export let players: Player[] = Array.from(
    events
      ?.reduce((acc, { type, name, display_name }) => {
        let {
          battles = 0,
          marbles = 0,
          baskets = 0,
          duels = 0,
        } = acc.get(name) ?? {};

        if (type === MarblesVictoryType) {
          marbles++;
        } else if (type === BasketBallVictoryType) {
          baskets++;
        } else if (type === BattleRoyaleVictoryType) {
          battles++;
        } else if (type === DuelVictoryType) {
          duels++;
        }

        return acc.set(name, {
          name,
          display_name,
          marbles,
          baskets,
          battles,
          duels,
        });
      }, new Map<string, Player>())
      .values()
  ).sort(
    (a, b) =>
      points(b) - points(a) || a.display_name.localeCompare(b.display_name)
  );
</script>

<svelte:head>
  <title>Stream Avatar Leaderboard</title>
</svelte:head>

<main class="container">
  <img class="image" src={image} alt="" />
  <h1 class="title">Stream Avatar Leaderboard</h1>

  <ol>
    {#each players as player}
      <li class="player">
        <a href="https://www.twitch.tv/{player.name}">
          {player.display_name}
        </a>
        <span class="points">: {points(player)}</span>
        {#if player.marbles}
          <span class="ball">🌕</span>
        {/if}
        {#each new Array(player.baskets) as _}
          <span class="ball">🏀</span>
        {/each}
        {#each new Array(player.duels) as _}
          <span class="ball">⚔️</span>
        {/each}
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

  .title {
    text-align: center;
  }

  .player {
    margin: 0.25rem 0;
    font-size: 0;
  }

  .player::marker,
  .player > * {
    font-size: 1rem;
  }

  .points {
    margin-right: 0.25rem;
  }

  .ball {
    font-size: 0.875rem;
    margin-left: 0.25rem;
  }
</style>
