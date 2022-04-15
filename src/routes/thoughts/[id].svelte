<script context="module">
  export async function load({ params, fetch, session, stuff}) {
    const req = await fetch("/thoughts/__data.json")
    const res = await req.json()

    if(res[params.id]) {
      return {
        status: 200,
        props: {
          thought: res[params.id],
          id: params.id
        }
      }
    }

    return {
      status: 404
    }
  }
</script>


<script>
  export let thought;
  export let id;
  import Thought from "$lib/Thought.svelte"

</script>

<Thought {...thought}></Thought>

<h2>Leave a comment:</h2>
