//Adds array(s) to the end of another, in place
export default function arrayAdd(arr, ...arrs) {
  arrs.forEach(addArr => {
    addArr.forEach(value => {
      arr.push(value);
    })
  })

  return arr;//just to make code easier (method chaining, etc)
}
