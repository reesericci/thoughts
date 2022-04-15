
  <script>
    export let message
    export let dateString
    export let id
    import { goto } from "$app/navigation";

    function clickHandler() {
    	if(id || id == 0) {
    		goto(`/thoughts/${id}`)
    	}
    }
  </script>

  <div on:click={clickHandler}>
	  <h2>
		  {message}
	  </h2>
	  <p>
		  {dateString}
	  </p>
  </div>


  <style>
  	  @import url('http://fonts.cdnfonts.com/css/helvetica-neue-9');
	  div {
	  	background-color: black;
	  	color: white;
	  	padding-top: 0.5rem;
	  	padding-bottom: 0.5rem;
	  	border-radius: 10px;
	  	word-wrap: break-word;
	  	width: 35rem;
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

