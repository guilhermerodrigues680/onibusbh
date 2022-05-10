const fs = require("fs");
const paradas = require("./paradasIn.json");

// A cada 500
// 30694
// 9674

// A cada 250
// 122222
// 9674

const arr = paradas.paradas;
const arr2 = arr.map(a => a.paradas);
// let arr3 = arr2.reduce((v, acc) => {
//   acc.push(...v);
//   return acc;
// }, []);
let arr3 = [];
for (const a of arr2) {
  arr3.push(...a);
}

console.debug(arr3.length);

arr3 = arr3.filter(
  (item, index, arrrrrrr) => arrrrrrr.findIndex(iii => iii.cod == item.cod) === index
);

console.debug(arr3.length);

arr3.sort((a, b) => a.cod - b.cod);

// const map = new Map()
// for (const p of arr) {

// }

let data = JSON.stringify(arr3, null, 2);
fs.writeFileSync("paradas.json", data);
