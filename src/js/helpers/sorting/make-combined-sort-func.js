export default function makeCombinedSortFunc(...sortFuncs) {
  return (a, b) => {
    for(let i = 0; i < sortFuncs.length; i++) {
      let res = sortFuncs[i](a,b);

      if(res !== 0) {
        return res;
      }
    }

    return 0;
  }
}
