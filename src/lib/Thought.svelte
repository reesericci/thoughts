
  <script>
    export let message
    export let date
    export let id
    export let edited
    export let oldMessages
    import { goto } from "$app/navigation";
    import 'temporal-polyfill/global';

    function clickHandler() {
    	if(id || id == 0) {
    		goto(`/thoughts/${id}`)
    	}
    }

    let timesEditedString = oldMessages.length > 1 ? oldMessages.length + " times" : ""
  </script>

  <div class="main" on:click={clickHandler}>
  	  {#if edited}
  		<div class="edited">
  			<h2> This thought was edited {timesEditedString}</h2>
  		</div>
  	  {/if}
	  <h2>
		  {message}
	  </h2>
	  <p>
		  {Temporal.ZonedDateTime.from(date).toLocaleString()}
	  </p>
  </div>


  <style>
  	  @import url('http://fonts.cdnfonts.com/css/helvetica-neue-9');
	  div.main {
	  	background-color: black;
	  	color: white;
	  	padding-top: 0.5rem;
	  	padding-bottom: 0.5rem;
	  	border-radius: 10px;
	  	word-wrap: break-word;
	  	width: 35rem;
	  	margin-bottom: 0.5rem;
	  }

	  div.edited {
	  	margin-top: 0.5rem;
	  	background-color: red;
	  	padding: 0.25rem;
	  }

	  div.edited > h2 {
	  	margin-top: 0.5rem;
	  	margin-bottom: 0.5rem;
	  }

	  h2,p {
		padding-left: 0.5rem;
		font-family: "Helvetica Neue", system-ui;
      	  }

	  @media (max-width: 40rem) {
	  	div {
	  		width: 100%;
	  	}
	  }
  </style>

