import Extension from './extension';

class Syntax {
  constructor() {
    this.syntax = {};
  }
}

async function wait(result) {
  const p = new Promise((resolve) => {
    setTimeout(() => {
      resolve(result);
    }, 500);
  });

  return await p;
}

wait('resolved').then(console.log);

new Extension('shim');
