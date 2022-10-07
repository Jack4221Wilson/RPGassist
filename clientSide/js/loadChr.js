const yogBtn = document.getElementById('characterBtn')
const baseUrl = window.location.origin
const host = window.location.host
console.log(baseUrl)
console.log(host)

yogBtn.addEventListener('click', async () => {
  const characterUrl = baseUrl + '/js/campaigns/test/characters/PCs/Yog.json'
  const response = await fetch(characterUrl)
  const yogJson = await response.text()
  const yog = JSON.parse(yogJson)
  document.body.appendChild(createSheet(yog))
})

function createSheet (chr) {
  const characterSheet = document.createElement('div')
  characterSheet.className = 'sheet'
  characterSheet.appendChild(boxer(chr))
  return characterSheet
}

function createBox (boxName) {
  const box = document.createElement('div')
  box.className = boxName
  box.innerHTML = `<h1>${boxName}:</h1>`
  return box
}

function boxer (obj) {
  const box = document.createElement('div')
  Object.keys(obj).forEach((thing, i) => {
    const thingsBox = createBox(thing)
    const thingsValue = Object.values(obj)[i]
    if (typeof thingsValue !== 'object') {
      thingsBox.appendChild(inputMaker(thingsValue))
    } else {
      thingsBox.appendChild(boxer(thingsValue))
    }
    box.appendChild(thingsBox)
  })
  return box
}
function inputMaker (value) {
  const valueElement = document.createElement('input')
  if (typeof value !== 'boolean') {
    valueElement.setAttribute('type', 'text')
    valueElement.setAttribute('value', `${value}`)
    const inputSize = `${value}`.length
    valueElement.setAttribute('size', `${inputSize + 2}`)
    return valueElement
  } else {
    valueElement.setAttribute('type', 'checkbox')
    if (value == true){
      valueElement.setAttribute('checked', '')
    }
    return valueElement
  }
}