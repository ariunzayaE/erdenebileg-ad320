import { Router } from 'express'
import { User } from '../models/User.js'

const usersRouter = Router()

function sanitizeUsers(users) {
  const sanitizedUsers = users.map((user) => ({
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    decks: user.decks,
    active: user.active
  }))
  return sanitizedUsers
}

const getUsers = async (req, res) => {
  const {userId} = req.user
  console.log(req.user)
  const requestor = await User.findById(userId)
  if(requestor.role === 'admin' || requestor.role === 'superuser'){
    const users = await User.find({})
    res.send(sanitizeUsers(users))
  } else {
    res.status(403).send('Forbidden')
  }
}

const getUsersById = async (req, res) => {
  const {userId} = req.user // i wrote myself user id in the localhost url
  const requestor = await User.findById(userId)   // the user who is requesting user ID 
  if(requestor.role === 'admin' || 
  requestor.role === 'superuser' ||
  (requestor.role === 'user' && requestor._id.toString() === req.params_id.toString())){
    const user = await User.findById(req.params.id)
    res.send(sanitizeUsers(user))
  } else {
    res.status(403).send('Forbidden')
  }
}

const updateUser = async (req, res) => {
  const {userId} = req.user
  const requestor = await User.findByIdAndUpdate(userId)
  if(requestor.role === 'admin' || 
  (requestor.role === 'superuser' && requestor._id === req.params_id) ||
  (requestor.role === 'user' && requestor._id === req.params_id)
  ){
  const result = await User.findByIdAndUpdate(req.params.id, req.body)
  res.send(sanitizeUsers([result]))
  console.log('result ', result)
  } else{
    res.status(503).send('Can not update the user')
  }
}

const deleteUser = async (req, res) => {
  const {userId} = req.user
  const requestor = await User.findById(userId)
  if(requestor.role === 'admin' || 
  (requestor.role === 'superuser' && requestor._id === req.params_id)
  ){
    const result = await User.findByIdAndUpdate(req.params.id, { active: false })
    res.send(sanitizeUsers([result]))
    console.log('result ', result)
    } else {
      res.status(503).send('Can not delete the user')
    }
  }

usersRouter.get('/', getUsers)
usersRouter.get('/:id', getUsersById)
usersRouter.put('/:id', updateUser)
usersRouter.delete('/:id', deleteUser)

export default usersRouter
