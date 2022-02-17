import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { Deck } from './models/Deck.js'

const app = express()
const port = 8000

// Connect to MongoDB

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@crit-cluster.bpw1p.mongodb.net/notoriety?retryWrites=true&w=majority`
try {
  await mongoose.connect(connectionString)
} catch (err) {
  console.log('error ', err)
}

// Middleware

const exampleMiddleware = (req, res, next) => {
  console.log('example middleware')
  next()
}

app.use(cors())
app.use(express.json())
app.use(exampleMiddleware)

// Routes

//localhost:8000
// health check
app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// get all cards from deck without width
// localhost:8000/decks/deckID/cards
// localhost:8000/decks/4/cards   // 4 is deck id as an example
app.get('/decks/:id/cards', async (req, res) => {
  const limit = req.query.limit
  const deck = await Deck.findById(req.params.id)
  if (deck) {
    res.send(deck.cards.slice(0, 5))
  } else {
    res.sendStatus(404)
  }
})

const cardsById = async (req, res) => {
  const card = await Deck.findOne({
    'cards._id': req.params.id
  })
  res.status(200).send(card)
}


//Get an individual card by id
// localhost:8000/cards/c1bdb3be
app.get('/cards/:id', cardsById)

const isUrl = (value) => {
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  return re.test(value)
}

// Create card
// localhost:8000/cards/
app.post('/test', async (req, res) => {
  console.log(req.body)
  res.send(req.body.test)
})

app.post('/cards', async (req, res) => {
  const cardRequest = req.body
  
  if ((!cardRequest.frontImage && !cardRequest.frontText) || 
    (!cardRequest.backImage && !cardRequest.backText)) {
    res.status(400).send('Card data incomplete')
  }

  if ((frontImage && !isUrl(frontImage)) || (backImage && !isUrl(backImage))) {
    res.status(400).send('Image fields must be valid URLs')
  }

  if (!cardRequest.deckId) {
    res.status(400).send('Deck ID is required')
  }

  try {
    const deck = await Deck.findById(cardRequest.deckId)
    if (deck) {
      deck.cards.push({
        frontImage: cardRequest.frontImage,
        frontText: cardRequest.frontText,
        backImage: cardRequest.backImage,
        backText: cardRequest.backText
      })
      await deck.save()
      res.sendStatus(204)
    } else {
      res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    res.sendStatus(502)
  }
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})