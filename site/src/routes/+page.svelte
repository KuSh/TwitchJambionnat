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

  type POINTS = {
    baskets: number;
    battles: number;
    duels: number;
    gartics: number;
    marbles: number;
    poops: number;
    skyjos: number;
  };

  // ref: https://github.com/Microsoft/TypeScript/issues/13298#issuecomment-707369176
  /* eslint-disable @typescript-eslint/no-explicit-any */
  type ValueTuple<O, T extends keyof O = keyof O> = (
    (T extends any ? (t: T) => T : never) extends infer U
      ? (U extends any ? (u: U) => any : never) extends (v: infer V) => any
        ? V
        : never
      : never
  ) extends (_: any) => infer W
    ? [...ValueTuple<O, Exclude<T, W>>, O[Extract<W, keyof O>]]
    : [];
  /* eslint-enable */

  type Player = {
    name: string;
    display_name: string;
    path: string | undefined;
    index: number;
    score: number;
    points: ValueTuple<POINTS>;
  };
</script>

<script lang="ts">
  export let data: PageServerData;

  export let events = data.events;

  export const score = ({
    points: [baskets, battles, duels, gartics, marbles, _, skyjos],
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

  const players = events.reduce((acc, { type, name, display_name, path }) => {
    let [
      baskets = 0,
      battles = 0,
      duels = 0,
      gartics = 0,
      marbles = 0,
      poops = 0,
      skyjos = 0,
    ] = acc.get(name)?.points ?? [];

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
      index: 0,
      score: 0,
      points: [baskets, battles, duels, gartics, marbles, poops, skyjos],
    });
  }, new Map<string, Player>());

  export const scores = Array.from(players.values())
    .map((player) => ({ ...player, score: score(player) }))
    .sort(
      (a, b) =>
        b.score - a.score || a.display_name.localeCompare(b.display_name)
    )
    .reduce((scores, player, index) => {
      return scores.set(player.score, [
        ...(scores.get(player.score) ?? []),
        { ...player, index },
      ]);
    }, new Map<number, [Player, ...Player[]]>());
</script>

<svelte:head>
  <title>Classement Jambionnat</title>
</svelte:head>

<main
  class="rounded-xl m-1 lg:m-auto lg:my-8 lg:max-w-4xl p-4 lg:p-8 bg-white dark:bg-[#0d0d0d] drop-shadow-lg dark:drop-shadow-none"
>
  <img class="mx-auto" src={image} width="197" height="256" alt="" />
  <nav class="uppercase my-8 flex flex-col">
    <a
      class="text-indigo-500 dark:text-blue-500 hover:underline w-min mx-auto"
      href="rules">Règles</a
    >
    <a
      class="text-indigo-500 dark:text-blue-500 hover:underline w-max mx-auto"
      href="description">Présentation des jeux</a
    >
  </nav>
  <h1 class="text-2xl font-semibold text-center my-8">Classement Jambionnat</h1>

  <table class="w-full">
    <caption class="caption-bottom text-center">
      Nombre de battles royale : {events
        .filter(({ type }) => type === BattleRoyaleVictoryType)
        .reduce((count) => count + 1, 0)}
    </caption>
    <thead>
      <tr class="border-b-2 text-left">
        <th scope="col" class="text-center">#</th>
        <th scope="col" class="px-2">Nom</th>
        <th scope="col">Score</th>
        <th scope="col" class="text-center">💩</th>
      </tr>
    </thead>
    {#each scores as [score, players], place}
      <tbody>
        {#each players as player, i}
          <tr
            class="border-t leading-8 {player.index % 2
              ? 'bg-white dark:bg-[#0d0d0d]'
              : 'bg-gray-50 dark:bg-[#232323]'}"
          >
            {#if i === 0}
              <td
                class="text-center bg-white dark:bg-[#0d0d0d]"
                rowspan={players.length}
              >
                {place + 1}
              </td>
            {/if}
            <td class="px-2">
              <a
                href="https://www.twitch.tv/{player.path ?? player.name}"
                class="text-indigo-500 dark:text-blue-500 hover:underline"
              >
                {player.display_name}
              </a>
            </td>
            <td>
              {score}
              {#if player.points[MARBLES_INDEX]}
                {" "}<span class="text-sm">🌕</span>
              {/if}
              {#each new Array(player.points[BASKETS_INDEX]) as _}
                {" "}<span class="text-sm">🏀</span>
              {/each}
              {#each new Array(player.points[DUELS_INDEX]) as _}
                {" "}<span class="text-sm">⚔️</span>
              {/each}
              {#each new Array(player.points[SKYJOS_INDEX]) as _}
                {" "}<span class="text-sm">🎴</span>
              {/each}
              {#each new Array(player.points[GARTICS_INDEX]) as _}
                {" "}<span class="text-sm">✏️</span>
              {/each}
            </td>
            <td class="text-center">
              {#if player.points[POOPS_INDEX]}
                {player.points[POOPS_INDEX]}
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    {/each}
  </table>
</main>
