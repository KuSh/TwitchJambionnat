<script lang="ts" context="module">
  import image from "$lib/assets/jambionnat-256.png";
  import {
    BasketBallVictoryType,
    BattleRoyaleVictoryType,
    DuelVictoryType,
    MarblesVictoryType,
  } from "$lib/types";
  import type { PageServerData } from "./$types";

  type Player = {
    name: string;
    display_name: string;
    path: string | undefined;
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
      ?.reduce((acc, { type, name, display_name, path }) => {
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
          path,
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
  <title>Classement jambionnat</title>
</svelte:head>

<main
  class="rounded-xl m-1 lg:m-auto lg:my-8 lg:max-w-4xl p-4 lg:p-8 bg-white dark:bg-white/5 drop-shadow-lg dark:drop-shadow-none"
>
  <img class="mx-auto" src={image} width="197" height="256" alt="" />
  <h1 class="text-2xl font-semibold text-center my-8">Classement jambionnat</h1>

  <table class="w-full">
    <thead>
      <tr class="border-b-2 text-left">
        <th class="px-2 text-right">#</th>
        <th class="px-2">Nom</th>
        <th class="px-2">Score</th>
      </tr>
    </thead>
    <tbody>
      {#each players as player, i}
        <tr
          class="border-t even:bg-gray-50 dark:even:dark:bg-white/5 leading-8"
        >
          <td class="px-2 text-right">{i + 1}</td>
          <td class="px-2">
            <a
              href="https://www.twitch.tv/{player.path ?? player.name}"
              class="text-indigo-500 dark:text-blue-500 hover:underline"
            >
              {player.display_name}
            </a>
          </td>
          <td class="px-2">
            {points(player)}
            {#if player.marbles}
              {" "}<span class="text-sm">🌕</span>
            {/if}
            {#each new Array(player.baskets) as _}
              {" "}<span class="text-sm">🏀</span>
            {/each}
            {#each new Array(player.duels) as _}
              {" "}<span class="text-sm">⚔️</span>
            {/each}
          </td>
        </tr>
      {/each}
    </tbody>
    <tfoot>
      <tr>
        <td colspan="3" class="text-center">
          Nombre de battles royale : {events
            .filter(({ type }) => type === BattleRoyaleVictoryType)
            .reduce((count) => count + 1, 0)}
        </td>
      </tr>
    </tfoot>
  </table>
</main>
