

const I = x => x; // identoty
const o = (f, g) => x => f(g(x)); // composer 
const K = x => () => x; // closure to store value

// func list reducer pipe([f1 f2, f3, f4])(x)  -> f4( f3( f2( f2( I(x)) ) ) ) ;
const pipe = xs => xs.reduceRight(o, I);

const P = p => state => Object.assign(state, p) // return a patch func 

const log = a => { console.log(a); return a; };

export const up = update => p => pipe([P, update])(p);