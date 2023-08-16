<script lang="ts" context="module">
  import image from "$lib/assets/jambionnat-256.png";
  import {
    BasketBallVictoryType,
    BattleRoyalePoopType,
    BattleRoyaleVictoryType,
    DuelVictoryType,
    GarticShowVictoryType,
    MarblesVictoryType,
    SkyjoVictoryType,
  } from "$lib/types";
  import type { PageServerData } from "./$types";

  type SCORES = {
    baskets: number;
    battles: number;
    duels: number;
    gartics: number;
    marbles: number;
    poops: number;
    skyjos: number;
  };

  // ref: https://github.com/Microsoft/TypeScript/issues/13298#issuecomment-707369176
  type ValueTuple<O, T extends keyof O = keyof O> = (
    (T extends any ? (t: T) => T : never) extends infer U
      ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
        ? V
        : never
      : never
  ) extends (_: any) => infer W
    ? [...ValueTuple<O, Exclude<T, W>>, O[Extract<W, keyof O>]]
    : [];

  type Player = {
    name: string;
    display_name: string;
    path: string | undefined;
    scores: ValueTuple<SCORES>;
  };
</script>

<script lang="ts">
  export let data: PageServerData;

  export let events = data.events;

  export const points = ({
    scores: [baskets, battles, duels, gartics, marbles, _, skyjos],
  }: Player) => {
    return battles + duels + 3 * (baskets + gartics) + 5 * (marbles + skyjos);
  };

  export const BASKETS_INDEX = 0;
  export const BATTLES_INDEX = 1;
  export const DUELS_INDEX = 2;
  export const GARTICS_INDEX = 3;
  export const MARBLES_INDEX = 4;
  export const POOPS_INDEX = 5;
  export const SKYJOS_INDEX = 6;

  export let players: Player[] = Array.from(
    events
      ?.reduce((acc, { type, name, display_name, path }) => {
        let [
          baskets = 0,
          battles = 0,
          duels = 0,
          gartics = 0,
          marbles = 0,
          poops = 0,
          skyjos = 0,
        ] = acc.get(name)?.scores ?? [];

        switch (type) {
          case BasketBallVictoryType:
            baskets++;
            break;
          case BattleRoyalePoopType:
            poops++;
            break;
          case BattleRoyaleVictoryType:
            battles++;
            break;
          case DuelVictoryType:
            duels++;
            break;
          case GarticShowVictoryType:
            gartics++;
            break;
          case MarblesVictoryType:
            marbles++;
            break;
          case SkyjoVictoryType:
            skyjos++;
            break;
        }

        return acc.set(name, {
          name,
          display_name,
          path,
          scores: [baskets, battles, duels, gartics, marbles, poops, skyjos],
        });
      }, new Map<string, Player>())
      .values()
  ).sort(
    (a, b) =>
      points(b) - points(a) || a.display_name.localeCompare(b.display_name)
  );
</script>

<svelte:head>
  <title>Classement Jambionnat</title>
</svelte:head>

<main
  class="rounded-xl m-1 lg:m-auto lg:my-8 lg:max-w-4xl p-4 lg:p-8 bg-white dark:bg-white/5 drop-shadow-lg dark:drop-shadow-none"
>
  <img class="mx-auto" src={image} width="197" height="256" alt="" />
  <nav class="uppercase my-8 flex flex-col">
    <a
      class="text-indigo-500 dark:text-blue-500 hover:underline w-min mx-auto"
      href="rules">Règles</a
    >
    <!--
    <a
      class="text-indigo-500 dark:text-blue-500 hover:underline w-max mx-auto"
      href="description">Présentation des jeux</a
    >
    -->
  </nav>
  <h1 class="text-2xl font-semibold text-center my-8">Classement Jambionnat</h1>

  <table class="w-full">
    <thead>
      <tr class="border-b-2 text-left">
        <th class="text-right">#</th>
        <th class="px-2">Nom</th>
        <th>Score</th>
        <th class="text-center">💩</th>
      </tr>
    </thead>
    <tbody>
      {#each players as player, i}
        <tr
          class="border-t even:bg-gray-50 dark:even:dark:bg-white/5 leading-8"
        >
          <td class="text-right">{i + 1}</td>
          <td class="px-2">
            <a
              href="https://www.twitch.tv/{player.path ?? player.name}"
              class="text-indigo-500 dark:text-blue-500 hover:underline"
            >
              {player.display_name}
            </a>
          </td>
          <td>
            {points(player)}
            {#if player.scores[MARBLES_INDEX]}
              {" "}<span class="text-sm">🌕</span>
            {/if}
            {#each new Array(player.scores[BASKETS_INDEX]) as _}
              {" "}<span class="text-sm">🏀</span>
            {/each}
            {#each new Array(player.scores[DUELS_INDEX]) as _}
              {" "}<span class="text-sm">⚔️</span>
            {/each}
            {#each new Array(player.scores[SKYJOS_INDEX]) as _}
              {" "}<span class="text-sm">🎴</span>
            {/each}
            {#each new Array(player.scores[GARTICS_INDEX]) as _}
              {" "}<span class="text-sm">✏️</span>
            {/each}
          </td>
          <td class="text-center">
            {#if player.scores[POOPS_INDEX]}
              {player.scores[POOPS_INDEX]}
            {/if}
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
