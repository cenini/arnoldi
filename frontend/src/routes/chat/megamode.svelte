<script lang="ts">

  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'

  let megaMode: boolean = false;

  onMount(() => {
    themeChange(false)
  })

  function isDisabled() {
    return false;
  }

</script>

<div class="tooltip" data-tip="Mega-mode">
  <input bind:checked={megaMode} type="checkbox" data-toggle-theme="valentine,coffee" class="toggle toggle-secondary" data-act-class="ACTIVECLASS" disabled='{isDisabled()}' />
</div>