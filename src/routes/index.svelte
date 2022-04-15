<script context="module">
  import 'temporal-polyfill/global'
  export async function load({ params, fetch, session, stuff }) {
    try {
      const req = await fetch("/thoughts/__data.json")
      const res = await req.json()
      if(res.length > 0) {
        return {
          status: 200,
          props: {
            thoughts: res.sort((a,b) => Temporal.ZonedDateTime.compare(Temporal.ZonedDateTime.from(a.date), Temporal.ZonedDateTime.from(b.date))).reverse()
          }
        }
      }
    } catch (e) {}

    return {
      status: 200,
      props: {
        thoughts: null
      }
    }
  }

</script>

<script>
  export let thoughts;
  import Thought from "$lib/Thought.svelte"
</script>

{#if thoughts}
  {#each thoughts as thought}
    <Thought {...thought}></Thought>
  {/each}
{:else}
  <h2>No thoughts available</h2>
{/if}

<style>

  h2 {
		font-family: "Helvetica Neue", system-ui;
  }
</style>  
