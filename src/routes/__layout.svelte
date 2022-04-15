<script>

  import { goto } from "$app/navigation";

</script>

<h1 on:click={() => { goto("/") }}>thoughts.reeseric.ci.</h1>


<slot></slot>

<style>

@import url('http://fonts.cdnfonts.com/css/helvetica-neue-9');

h1 {
	font-family: "Helvetica Neue", system-ui;
	font-weight: 700;
}
</style>
