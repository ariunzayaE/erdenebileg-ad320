import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'

import { Deck } from './models/Deck.js'
import { User } from './models/User.js'

const app = express()
const port = 8000

// Connect to MongoDB

const connectionString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.wbtmm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
try {
  await mongoose.connect(connectionString)
} catch (err) {
  console.log('error ', err)
}

// Middleware

const exampleMiddleware = (req, res, next) => {
  console.log(req.originalUrl)
  next()
}

app.use(cors())
app.use(express.json())
app.use(exampleMiddleware)

// Routes

app.get('/', (req, res) => {
  res.send('Hello, world!')
})

// Get all cards for a deck, with the option to paginate results
app.get('/decks/:id/cards', async (req, res) => {
  const limit = req.query.limit
  const deck = await Deck.findById(req.params.id)
  if (deck) {
    res.send(deck.cards.slice(0, 5))
  } else {
    res.sendStatus(404)
  }
})

// Get individual card by Id
const cardsById = async (req, res) => {
  const deck = await Deck.findOne({'cards._id': req.params.id})
  if (deck) {
    res.send(deck.cards.filter(card => card._id.toString() === req.params.id))
  } else {
    res.sendStatus(404)
  }
}

app.get('/cards/:id', cardsById)

const isUrl = (value) => {
  const re = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/
  return re.test(value)
}

// Get a deck by ID
app.get('/decks/:id', async (req, res) => {
  const deck = await Deck.findById(req.params.id)
  if (deck) {
    res.send(deck)
  } else {
    res.sendStatus(404)
  }
})


// Get a deck by user
app.get('/users/:id', async (req, res) => {
  const deck = await Deck.findOne({'userId': req.params.id})
  if (deck) {
    res.send(deck)
  } else {
    res.sendStatus(404)
  }
})

// Create a card
app.post('/cards', async (req, res) => {
  const cardRequest = req.body
  
  if ((!cardRequest.frontImage && !cardRequest.frontText) || 
    (!cardRequest.backImage && !cardRequest.backText)) {
    return res.status(400).send('Card data incomplete')
  }
  

  if ((cardRequest.frontImage && !isUrl(cardRequest.frontImage)) ||
  (cardRequest.backImage && !isUrl(cardRequest.backImage))) {
    return res.status(400).send('Image fields must be valid URLs')
  }

  if (!cardRequest.deckId) {
    return res.status(400).send('Deck ID is required')
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
      deck.size = deck.cards.length
      await deck.save()
      return res.sendStatus(204)
    } else {
      return res.sendStatus(404)
    }
  } catch (err) {
    console.log(`error in creating card ${err}`)
    return res.sendStatus(502)
  }
})


// Create a deck
app.post('/decks', async (req, res) => {
  const newDeck = new Deck({
    name: req.body.name,
    userId: new mongoose.Types.ObjectId(req.body.userId),
    cards: req.body.cards,
    size: req.body.cards.length
  })

  if ((!newDeck.name) || 
    (!newDeck.userId) || (!newDeck.cards) || 
    (!newDeck.size)) {
    return res.status(400).send('Deck data incomplete')
  }
  const savedDeck = await newDeck.save()
  res.send(savedDeck)
})


// Create a user
app.post('/users', async (req, res) => {
const newUser = new User({firstName: "Tim"})
const user = await newUser.save()
  res.send("incomplete");
})


// Update a card

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`)
})