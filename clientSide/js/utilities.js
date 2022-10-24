// Replaces all '_' from all headers with a space 
function underminer () {
  const h1s = document.body.querySelectorAll('h1')
  const h1Array = Array.from(h1s)

  h1Array.forEach((ele, i) => {
    const oldText = h1s[i].innerText
    const newText = oldText.replaceAll('_', ' ')
    h1s[i].innerText = newText
  })
}
// Calculates a modifier based on the stat value
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
// Changes the theme of the site
const lightswitch = document.body.querySelector('#lightswitch')
lightswitch.addEventListener('click', function (e) {
  if (lightswitch.value == 'light') {
    lightswitch.value = 'dark'
    document.body.className = ''
    return
  }
  lightswitch.value = 'light'
  document.body.className = 'light-mode'
})