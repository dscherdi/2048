  export const getPositionFromCoordinates = (x, y, h) => {
      return y*h + x;
  } 
  export const getCoordinatesFromPosition = (position, w, h) => {
      return {x: position%w, y: Math.floor(position/h)};
  } 
  export const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min ;
  };