<script lang="ts">

  import { onMount } from 'svelte'
  import { themeChange } from 'theme-change'
  import { megaMode } from '../../stores';

  export let megaModeValue: boolean;

  onMount(() => {
    themeChange(false)
    megaMode.subscribe(value => {
      megaModeValue = value
    })
  })

  function isDisabled() {
    return false;
  }

  function updateMegaMode() {
    megaMode.update(megaModeValue => !megaModeValue);
  }

</script>

<div class="tooltip" data-tip="Mega-mode">
  <input checked={megaModeValue} on:click={(e) => updateMegaMode()} type="checkbox" data-toggle-theme="coffee,valentine" class="toggle toggle-secondary" data-act-class="ACTIVECLASS" disabled='{isDisabled()}' />
</div>