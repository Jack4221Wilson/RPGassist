const path = require('path')
const express = require('express')
const app = express() // creates a server with the express library
const port = 8001 // port for server

// path to static 'front end' client-side files
const path2site = path.join(__dirname, './clientSide')
app.use(express.static(path2site))

// 3126952310

app.listen(
  port,
  () => {
    console.log(`Dance floor is at http://localhost:${port}`)
  }
)

app.get('/', (req, res) => {
  res.status(200).send('howdy')
  console.log('someone came to boogy at' + new Date())
})

app.get('/knock', (req, res) => {
  res.status(200).send({
    answer: true
  })
  console.log('there is a knock at the door')
})

app.get('/js/campaigns/test/characters/PCs/:name', (req, res, next) => {
  var characterName = req.params.name
  res.status(200).sendFile(characterName, function (err) {
    if (err) {
      next(err)
    } else {
      console.log('Sent:', characterName)
    }
    console.log('Sent:', characterName)
  })
})
