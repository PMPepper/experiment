export default function cssClassListToString() {
  for(let i = 0, l = arguments.length; i < l; i++) {
    if(arguments[i]) {
      buffer.push(arguments[i].toString());
    }
  }

  const classes = buffer.join(' ');
  buffer.length = 0;

  return classes;
}

const buffer = [];
