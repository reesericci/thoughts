<script>
  export let name;
  export let message;
  export let iso8601;

  import "temporal-polyfill/global"


  let dateString = "date unavailable"

  try {dateString = Temporal.ZonedDateTime.from(iso8601).toLocaleString()}
  catch(e){ dateString = "date unavailable"}

</script>

<div>
  <h2>{name}</h2>
  <h4>{dateString}</h4>
  <p>{message}</p>
</div>

<style>
  @import url('http://fonts.cdnfonts.com/css/helvetica-neue-9');
  * {
    font-family: "Helvetica Neue", sans-serif;
  }
  div {
    width: 25rem;
    min-height: 5rem;
    border-color: black;
    border: solid;
    margin-bottom: 1rem;
    padding: 1rem;
    border-radius: 10px;
  }

  h2 {
    margin-bottom: 0;
  }

  h4 {
    margin-top: 0.5rem;
  }
</style>
