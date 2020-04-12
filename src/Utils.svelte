<script context="module">
  export const getPositionFromCoordinates = (coord, x, y, h) => {
      return (y || coord.y)*h + (x || coord.x);
  } 
  export const getCoordinatesFromPosition = (position, w, h) => {
      return {col: position%w, row: Math.floor(position/h)};
  } 
  export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min ;
  };
</script>

<script>

</script>
