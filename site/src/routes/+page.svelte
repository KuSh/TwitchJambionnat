<script lang="ts" module>
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
</script>

<script lang="ts">
  import image from "$lib/assets/jambionnat-256.png?enhanced";

  let { data }: { data: PageServerData } = $props();
</script>

<svelte:head>
  <title>Classement Jambionnat</title>
</svelte:head>

<main
  class="rounded-xl m-1 lg:m-auto lg:my-8 lg:max-w-4xl p-4 lg:p-8 bg-white dark:bg-[#0d0d0d] drop-shadow-lg dark:drop-shadow-none"
>
  <enhanced:img class="mx-auto" src={image} alt="" />
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
      Nombre de battles royale : {data?.stats?.[BattleRoyaleVictoryType] ?? 0}
    </caption>
    <thead>
      <tr class="border-b-2 text-left">
        <th scope="col" class="text-center">#</th>
        <th scope="col" class="px-2">Nom</th>
        <th scope="col">Score</th>
        <th scope="col" class="text-center">💩</th>
      </tr>
    </thead>
    {#each data.scores ?? [] as [score, players], place (place)}
      <tbody>
        {#each players as player, i (i)}
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
              {#if player[MarblesVictoryType]}
                <span class="text-sm"> 🌕</span>
              {/if}
              {#each new Array(player[BasketBallVictoryType] ?? 0) as _, i (i)}
                <span class="text-sm"> 🏀</span>
              {/each}
              {#each new Array(player[DuelVictoryType] ?? 0) as _, i (i)}
                <span class="text-sm"> ⚔️</span>
              {/each}
              {#each new Array(player[SkyjoVictoryType] ?? 0) as _, i (i)}
                <span class="text-sm"> 🎴</span>
              {/each}
              {#each new Array(player[GarticShowVictoryType] ?? 0) as _, i (i)}
                <span class="text-sm"> ✏️</span>
              {/each}
            </td>
            <td class="text-center">
              {#if player[BattleRoyalePoopType]}
                {player[BattleRoyalePoopType]}
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    {/each}
  </table>
</main>
