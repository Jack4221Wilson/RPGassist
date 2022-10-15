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