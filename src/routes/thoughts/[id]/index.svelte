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
  import { Iodine } from '@kingshott/iodine';
  import { invalidate } from "$app/navigation"
  import { onMount } from 'svelte';
  import { toast } from "@zerodevx/svelte-toast";


  let errors = new Set()

  const iodine = new Iodine()

  iodine.addRule('present', (value) => value != undefined && value.match(/\S+/));

  iodine.setErrorMessage("present","value must be present")


  let dateString = Temporal.Now.zonedDateTimeISO().toString()


  async function submitComment(el,event) {
    let inputs = [...el.querySelectorAll("input[data-rules]"),...el.querySelectorAll("textarea[data-rules]")];


    event.preventDefault()

    dateString = Temporal.Now.zonedDateTimeISO().toString()

    // Validation
    inputs.map((input) => {

      const isValid = iodine.is(input.value, JSON.parse(input.dataset.rules))

      if(isValid == true) {

        JSON.parse(input.dataset.rules).forEach((rule) => {
          const error = input.name + ": " + iodine.getErrorMessage(rule).toLowerCase()
          console.log(error)
          if(errors.has(error) == true) {
            errors.delete(error)
          }
        })

      }

      if (isValid !== true) {

        console.log("error alert")
        event.preventDefault();
        input.classList.add("invalid");
        const error = input.name + ": " + iodine.getErrorMessage(isValid).toLowerCase()

        if(errors.has(error) == false) {

            errors.add(error)

        }
        errors = errors
      }
    });

    // Submitting form

    if([...errors].length > 0) return;

    try {
      const response = await fetch(window.location.pathname + "/comments", {
        method: 'POST',
        headers: {
          Accept: "application/json"
        },
        body: new FormData(el),
      });

      if(response.ok == false) {
        console.log("not ok")
        throw new Error(await response.text())
      }

      await invalidate()
      await invalidate("/thoughts/__data.json")

      el.reset()

      toast.push('Comment posted successfully!', {
        theme: {
          '--toastBackground': '#48BB78',
          '--toastBarBackground': '#2F855A'
        }
      })


    } catch(e) {
      console.error(e)
      el.reset()

      toast.push(`Unable to post message: ${e.message}`, {
        theme: {
          '--toastBackground': '#F56565',
          '--toastBarBackground': '#C53030'
        }
      })

    }

  }


</script>

<Thought {...thought}></Thought>



<h2>Comment Section:</h2>


<h3>Leave a comment:</h3>

<!--><form use:form method="post" on:feltesuccess="{handleSuccess}"
  on:felteerror="{handleError}">-->
<form method="post" on:submit={function(event) { submitComment(this,event) } }>
  <ul>
    {#each [...errors] as error}
        <li>{error}</li>
    {/each}
  </ul>
  <div>
    <label for="name">name:</label>
    <input name="name" data-rules='["required","present"]'>
  </div>
  <div>
    <label for="name">email (this will NOT be public):</label>
    <input name="email" data-rules='["email"]'>
  </div>
  <div>
    <textarea placeholder="type your comment" data-rules='["required","present"]' name="message"></textarea>
  </div>
  <input type="hidden" bind:value={dateString} name="iso8601">
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
