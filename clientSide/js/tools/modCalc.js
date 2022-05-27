const stat = 12

function modCalc (baseStat) {
  let mod = -6
  if (baseStat > 0) {
    for (let i = 0; i <= baseStat; i++) {
      if (i % 2 === 0) {
        mod = mod + 1
      }
    }
  }
  return mod
}

console.log(modCalc(stat))
