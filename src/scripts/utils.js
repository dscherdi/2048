  export const getPositionFromCoordinates = (coord, x, y, h) => {
      return (y || coord.y)*h + (x || coord.x);
  } 
  export const getCoordinatesFromPosition = (position, w, h) => {
      return {x: position%w, y: Math.floor(position/h)};
  } 
  export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min ;
  };

  export const forloop = (arr, fun, inverse) => {
    let i, j;
    if(inverse) {
        i = arr.length - 1;
        j = -1;
    } else {
        i = 0;
        j = 1;
    }
    for(; i< arr.length && i > -1; i+=j) {
      fun(arr[i], i, arr, inverse);
    }
  }