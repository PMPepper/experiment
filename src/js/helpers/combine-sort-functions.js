export default function combineSortFunctions() {
  const args = arguments;

  return (a, b) => {
    let sortFunc = null;
    let result = null;

    for(let i = 0; i < arguments.length; i++) {
      sortFunc = arguments[i];

      if(sortFunc) {
        result = sortFunc(a, b);

        if(result !== 0) {
          return result;
        }
      }
    }

    return 0;
  }
}
