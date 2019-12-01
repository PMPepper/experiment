export default function arrayRemove(arr, item) {
  const index = arr.indexOf(item);

  if(index === -1) {
    return arr;
  } else {
    const newArr = [...arr];

    newArr.splice(index, 1);

    return newArr;
  }
}
