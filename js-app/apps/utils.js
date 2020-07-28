
export const compoR = (...fns) => x => fns.reduceRight((res, fn) => fn(res), x);

export const compoL = (...fns) => x => fns.reduceLeft((res, fn) => fn(res), x);

export const tap = f => x => { f(x); return x; };

export const trace = label => tap(console.log.bind(console, `${label}:`));

export const trims = str => str.trim().split(' ')[0];

const I = x => x; // identity

const o = (f, g) => x => f(g(x)); // composer 

const K = x => () => x; // closure to store value

// func list reducer pipe([f1 f2, f3, f4])(x)  -> f4( f3( f2( f2( I(x)) ) ) ) ;
const pipe = xs => xs.reduceRight(o, I);

const P = p => state => Object.assign(state, p) // return a patch func 

const log = a => { console.log(a); return a; };

export const up = update => p => pipe([P, update])(p);

export const checkArray = a => !!a && Array.isArray(a) && a.length > 0 ? true : false;