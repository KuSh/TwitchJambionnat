<script lang="ts" context="module">
  import ExpandIcon from "$lib/assets/expand.svg?raw";
</script>

<script lang="ts">
  export let title: string;
</script>

<section class="container">
  <h2 class="title">
    <span>{title}</span>
    <button>{@html ExpandIcon}</button>
    <!-- <span class="icon"></span> -->
  </h2>
  <slot />
</section>

<style>
  .container {
    width: 100%;

    /* debug */
    border: 1px var(--color) solid;
  }

  .title {
    align-items: center;
    color: var(--color) 87%;
    display: inline-flex;
    justify-content: space-between;
    line-height: 3;
    width: 100%;
  }

  .title :global(*) {
    padding: 0 1.5rem;
  }

  .title :global(svg) {
    color: var(--color) 38%;
  }

  .title::after {
    content: ExpandIcon;
  }
</style>
