
export const compoR= (...fns) => x => fns.reduceRight( (res, fn) => fn(res), x);
export const compoL= (...fns) => x => fns.reduceLeft( (res, fn) => fn(res), x);
export const tap= f => x => { f(x); return x; };
export const trace= label => tap(console.log.bind(console, `${label}:`) );

export const trims= str => str.trim().split(' ')[0];