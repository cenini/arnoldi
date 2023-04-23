<script lang="ts">

  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'

  onMount(() => {
    themeChange(false)
  })

  function isDisabled() {
    return false;
  }

</script>

<div class="tooltip" data-tip="Mega-mode">
  <input type="checkbox" data-toggle-theme="valentine,coffee" class="toggle toggle-secondary" data-act-class="ACTIVECLASS" disabled='{isDisabled()}' />
</div>