export default function classListToString() {
  const classes = [];

  for(let i = 0, l = arguments.length; i < l; i++) {
    if(arguments[i]) {
      if(arguments[i] instanceof Array) {
        let nestedClasses = classListToString.apply(null, arguments[i]);

        if(nestedClasses) {
          classes.push(nestedClasses);
        }
      } else {
        classes.push(arguments[i].toString());
      }
    }
  }

  return classes.join(' ');
}
