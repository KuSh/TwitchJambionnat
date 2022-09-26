<script lang="ts" context="module">
  import image from "$lib/assets/jambionnat-256.png";
  import MarblesIcon from "$lib/assets/marbles.svg?raw";
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

<main class="container is-max-desktop">
  <div class="card">
    <header class="card-header">
      <h1 class="card-header-title is-justify-content-center">
        Stream Avatar Leaderboard
      </h1>
    </header>
    <div class="card-image">
      <figure class="image is-flex is-justify-content-center">
        <img src={image} alt="The jambionnat king" />
      </figure>
    </div>
    <div class="card-content">
      <div class="content">
        <table class="table is-striped is-narrow is-hoverable">
          <thead>
            <tr>
              <th>Position</th>
              <th>Nom</th>
              <th>Score</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {#each leaderboard as { name, display_name, marbles, points }, i}
              <tr>
                <th class="has-text-centered">{i}</th>
                <td>
                  <a href="https://www.twitch.tv/{name}">{display_name}</a>
                </td>
                <td>{points}</td>
                <td>
                  {#if marbles}
                    {@html MarblesIcon}
                  {/if}
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
    <footer class="card-footer">
      <span class="card-footer-item">
        Nombre de battles royale : {events
          .filter(({ type }) => type === BattleRoyaleVictoryType)
          .reduce((count) => count + 1, 0)}
      </span>
    </footer>
  </div>
</main>

<style lang="scss">
  .card-header {
    box-shadow: unset;
  }

  .image img {
    width: auto;
  }
</style>
