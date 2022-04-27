<script context="module">
  export async function load({ params, fetch, session, stuff}) {
    const req = await fetch("/thoughts/__data.json")
    const res = await req.json()

    if(res[params.id]) {
      return {
        status: 200,
        props: {
          thought: res[params.id],
          id: params.id,
          comments: res[params.id].comments.map((val, i) => {
            return {id: i, ...val}
          })
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
  export let comments;
  import Thought from "$lib/Thought.svelte"
  import "temporal-polyfill/global"
  import Comment from "$lib/Comment.svelte"
  //import { createForm } from 'felte';
  import { Iodine } from '@kingshott/iodine';
  import { invalidate } from "$app/navigation"
  import { onMount } from 'svelte';

  $: {
    comments = comments;
    console.log("comments updated")
  }


  const errors = []

  /*
  const { form, errors } = createForm({
    validate: (values) => {
      const errors = {}

      if (!values.name) errors.name = [
        'You must provide a name',
      ];

      if(!values.message) errors.message = ["Your comment must not be empty"];

      return errors;
    }
  });

  function handleSuccess(event) {
    const { response, ...context } = event.detail;
    invalidate()
  }

  function handleError(event) {
    const { error, ...context } = event.detail;
    // `FelteSubmitError` contains a `response` property
    // with the response from `fetch`
    const response = error.response;
    // Do something with the error

    console.error(response)
  }

  */

  onMount(() => {

    const iodine = new Iodine();


    let form = document.getElementById("form");

    let inputs = [...form.querySelectorAll("input[data-rules]")];

    function onSubmit(event) {
      inputs.map((input) => {
        if (iodine.is(input.value, JSON.parse(input.dataset.rules)) !== true) {
          event.preventDefault();
          input.classList.add("invalid");
        }
      });
    }

    form.addEventListener("submit", onSubmit);

  });


</script>

<Thought {...thought}></Thought>



<h2>Comment Section:</h2>


<h3>Leave a comment:</h3>

<!--><form use:form method="post" on:feltesuccess="{handleSuccess}"
  on:felteerror="{handleError}">-->
<form method="post">
  <ul>
    {#each errors as error}
        {#if error != null}
          <li>{error}</li>
        {/if}
    {/each}
  </ul>
  <div>
    <label for="name">name:</label>
    <input name="name">
  </div>

  <div>
    <textarea placeholder="type your comment" name="message"></textarea>
  </div>
  <input type="hidden" value={Temporal.Now.zonedDateTimeISO().toString()} name="iso8601">
  <div>
    <input type="submit" value="submit">
  </div>
</form>


{#each comments as comment (comment.id)}
  <Comment {...comment}></Comment>
{/each}



<style>
  @import url('http://fonts.cdnfonts.com/css/helvetica-neue-9');
  * {
    font-family: "Helvetica Neue", sans-serif;
  }
  div {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }
  label {
    display: block;
    margin-bottom: 0.25rem;
    margin-top:0.25rem;
  }

  textarea {
    min-width: 20rem;
    min-height: 10rem;
  }

  li {
    color: red;
  }
</style>
