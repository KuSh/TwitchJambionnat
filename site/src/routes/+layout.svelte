<script>
  import "../app.scss";
</script>

<slot />

<style global>
  :root {
    --container-mx: auto;
    --container-max-w: 1040px;
    --gap: 24px;
    --columns: 12;
  }

  @media screen and (max-width: 1440px) {
    :root {
      --container-mx: 200px;
      --container-max-w: unset;
    }
  }

  @media screen and (max-width: 1240px) {
    :root {
      --container-mx: auto;
      --container-max-w: 880px;
    }
  }

  @media screen and (max-width: 905px) {
    :root {
      --container-mx: 32px;
      --container-max-w: unset;
      --columns: 8;
    }
  }

  @media screen and (max-width: 600px) {
    :root {
      --container-mx: 16px;
      --container-max-w: unset;
      --columns: 4;
    }
  }

  @media (prefers-color-scheme: dark) {
    ::selection {
      background-color: #004daa;
      color: #e8e6e3;
    }
    html,
    body {
      background-color: #181a1b;
      color: #e8e6e3;
    }
    a {
      color: #3391ff;
    }
  }
</style>
