export function rsd(n: number) {
  return `${n.toLocaleString("sr-RS").replace(/,/g, ".")} RSD`;
}

export function num(n: number) {
  return n.toLocaleString("sr-RS").replace(/,/g, ".");
}
