const items = [];


export function addItem(item) {
  if(!item || !(item instanceof Function)) {
    throw new Error('item must be a function');
  }

  if(items.includes(item)) {
    throw new Error('may no add the same item twice');
  }

  items.push(item);

  if(!isRunning) {
    start();
  }
}


export function removeItem(item) {
  const index = items.indexOf(item);

  if(index !== -1) {
    items.splice(index, 1);

    if(items.length === 0) {
      stop();
    }
  }
}

export function isItemAdded(item) {
  return items.includes(item);
}

let isRunning = false;
let isStopping = false;

function start() {
  isStopping = false;

  if(!isRunning) {
    isRunning = true;

    lastTime = performance.now();

    run();
  }
}

function stop() {
  isStopping = true;
}

function run() {
  if(!isRunning || isStopping) {
    isRunning = false;
    isStopping = false;
    return;
  }

  const now = performance.now();
  const elapsedTime = (now - lastTime) / 1000;

  //Call all registered handlers
  items.forEach(item => {item(elapsedTime)})

  //Queue up next call
  window.requestAnimationFrame(run);

  lastTime = now;
}

let lastTime = 0;
