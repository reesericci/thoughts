<script>

  import { goto } from "$app/navigation";
  import { SvelteToast } from '@zerodevx/svelte-toast'

</script>


<SvelteToast />

<h1 on:click={() => { goto("/") }}>thoughts.reeseric.ci.</h1>


<slot></slot>

<style>

@import url('https://fonts.cdnfonts.com/css/helvetica-neue-9');

:global(:root), *, h1 {
	font-family: "Helvetica Neue", system-ui;
	font-weight: 700;
}
</style>
