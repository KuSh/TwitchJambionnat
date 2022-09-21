<script lang="ts" context="module">
    import image from "$lib/assets/jambionnat-256.png";
    import {BattleRoyaleVictoryType, MarblesVictoryType} from "$lib/types";
    import type {PageServerData} from ".svelte-kit/types/src/routes/$types";

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
            ?.reduce((acc, {type, name, display_name}) => {
                const isMarble = type === MarblesVictoryType;
                const {points, marbles} = acc.get(name) ?? {points: 0, marbles: 0};
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

<section class="section">
    <div class="container">
        <div class="columns is-justify-content-center	">
            <div class="column is-half">
                <div class=" card">
                    <header class="card-header">
                        <h1 class="card-header-title has-text-centered">
                            Stream Avatar Leaderboard
                        </h1>
                    </header>
                    <div class="card-image">
                        <figure class="image">
                            <img src="{image}" alt="The jambionnat king">
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
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {#each leaderboard as {name, display_name, marbles, points}, i}
                                    <tr>
                                        <th class="has-text-centered">{i}</th>
                                        <td><a href="https://www.twitch.tv/{name}">{display_name}</a></td>
                                        <td>{points}</td>
                                        <td>
                                            {#if marbles}
                                                <svg style="width:24px;height:24px" viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                          d="M20.16 12.73C22.93 9.96 22.57 5.26 19.09 3C17.08 1.67 14.39 1.66 12.36 2.97C10.6 4.1 9.63 5.86 9.46 7.68C9.33 9 8.83 10.23 7.91 11.15L7.88 11.18C6.72 12.34 6.72 14.11 7.81 15.19L8.8 16.18C9.89 17.27 11.66 17.27 12.75 16.18C13.72 15.21 15 14.68 16.39 14.53C17.76 14.38 19.1 13.78 20.16 12.73M6.26 19.86C6.53 20.42 6.44 21.1 5.97 21.56C5.39 22.15 4.44 22.15 3.85 21.56C3.58 21.29 3.44 20.94 3.42 20.58C3.06 20.56 2.71 20.42 2.44 20.15C1.85 19.56 1.85 18.61 2.44 18.03C2.9 17.57 3.59 17.47 4.14 17.74L6.62 15.31C6.76 15.5 6.92 15.72 7.1 15.9L8.09 16.89C8.3 17.09 8.5 17.26 8.76 17.41L6.26 19.86Z"/>
                                                </svg>
                                            {/if}
                                        </td>
                                    </tr>
                                {/each}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div class="card-footer">
                        <footer>
                            Nombre de battles royale : {events
                            .filter(({type}) => type === BattleRoyaleVictoryType)
                            .reduce((count) => count + 1, 0)}
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    </div>
</section>
