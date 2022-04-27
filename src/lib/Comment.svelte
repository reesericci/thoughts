<script>
  export let name;
  export let message;
</script>

<div>
  <h2>{name}</h2>
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
</style>
