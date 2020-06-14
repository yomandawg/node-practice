const express = require('express')
const User = require('../models/user')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)

  try {
    await user.save()
    res.status(201).send(user)
  } catch(e) {
    res.status(400).send(e)
  }

  // user.save().then(() => {
  //   res.status(201).send(user)
  // }).catch(e => {
  //   res.status(400).send(e) // method chaining
  // })
})

router.get('/users', async (req, res) => {
  try {
    const users = await User.find({})
    res.send(users)
  } catch(e) {
    res.status(500).send()
  }
  
  // User.find({}).then((users) => {
  //   res.send(users)
  // }).catch(e => {
  //   res.status(500).send()
  // })
})

router.get('/users/:id', async (req, res) => {
  const _id = req.params.id

  try {
    const user = await User.findById(_id)
    if(!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(e) {
    res.status(500).send()
  }

  // User.findById(_id).then(user => {
  //   if(!user) {
  //     return res.status(404).send()
  //   }
  //   res.send(user)
  // }).catch(e => {
  //   res.status(500).send()
  // })
})

router.patch('/users/:id', async (req, res) => {
  const updates = Object.keys(req.body) // returns an array of keys
  const allowedUpdates = ['name', 'email', 'password', 'age']
  // runs the callback function for every item in the array
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  // error handling
  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    // any properties in `req.body` that are non-exist in the data model will be ignored
    // or else: error handling with `isValidOperation`
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true, // return new user instead of the one before
      runValidators: true // validate the new data
    })
    if(!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id)
    console.log(user)
    if(!user) {
      return res.status(404).send()
    }
    res.send(user)
  } catch(e) {
    res.status(500).send()
  }
})

module.exports = router