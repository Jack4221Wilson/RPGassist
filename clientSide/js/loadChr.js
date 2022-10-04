const yogBtn = document.getElementById('characterBtn')

yogBtn.addEventListener('click', async () => {
  const characterUrl = 'http://localhost:8001/js/campaigns/test/characters/PCs/Yog.json'
  const response = await fetch(characterUrl)
  const yogJson = await response.text()
  const yog = JSON.parse(yogJson)
  console.log(yog)
  document.body.appendChild(createSheet(yog))
})

function createSheet (chr) {
  const characterSheet = document.createElement('div')
  characterSheet.id = 'sheet'
  characterSheet.appendChild(boxer(chr))
  return characterSheet
}

function createBox (boxName) {
  const box = document.createElement('div')
  box.id = boxName
  box.innerHTML = `<h1>${boxName}:</h1>`
  return box
}

function boxer (obj) {
  const box = document.createElement('div')
  Object.keys(obj).forEach((thing, i) => {
    const thingsBox = createBox(thing)
    const thingsValue = Object.values(obj)[i]
    console.log(thingsValue)
    if (typeof thingsValue !== 'object') {
      const valueElement = document.createElement('p')
      valueElement.innerHTML = `${thingsValue}`
      thingsBox.appendChild(valueElement)
      console.log('showing value')
    } else {
      console.log('gonna need a new box')
      thingsBox.appendChild(boxer(thingsValue))
    }
    box.appendChild(thingsBox)
  })
  return box
}
