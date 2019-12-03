// comment
/*comment*/
// import func from './code.js';

// console.log(func());

let a = 124;
let b = 'ljlfffsdfj';

var bar = function() {
	console.log('hello');
}

async function foo() {
	var x = await fetch('https://api.github.com/gists/public');
	// console.log(x.json());
  // await bar();
  return x;
}

foo().then(x => {
	console.log(x);
	console.log(x.json());
})