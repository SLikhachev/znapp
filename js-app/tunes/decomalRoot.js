function decimalRoot(number, radix=10) {
  let num= Math.round(number);
  let root= 0;
  const next= function* (num) {
    let n= num, x= n / radix, r= n % radix;
    while (x > radix) {
      yield r;
      x= x / radix;
      r= x % radix;
    }
    yield r;
  };
  for (let nx of next(num) ) 
    root += nx;
  return root;
}