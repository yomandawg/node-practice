const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res) => {
  // const task = new Task(req.body)
  const task = new Task({
    ...req.body,
    owner: req.user._id // links new tasks to its owner
  })

  try {
    await task.save()
    res.status(201).send(task)
  } catch(e) {
    res.status(400).send(e)
  }

  // task.save().then(() => {
  //   res.status(201).send(task)
  // }).catch(e => {
  //   res.status(400).send(e)
  // }) 
})

router.get('/tasks', auth, async (req, res) => {
  try {
    // const tasks = await Task.find({})
    
    // const tasks = await Task.find({ owner: req.user._id })
    // res.send(tasks)
    await req.user.populate('tasks').execPopulate() // does the same thing as above
    res.send(req.user.tasks)
  } catch(e) {
    res.status(500).send()
  }

  // Task.find({}).then(tasks => {
  //   res.send(tasks)
  // }).catch(e => {
  //   res.status(500).send()
  // })
})

router.get('/tasks/:id', auth, async (req, res) => {
  const _id = req.params.id

  try {
    // const task = await Task.findById(_id)
    const task = await Task.findOne({ _id, owner: req.user._id })

    if(!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch(e) {
    // console.log(e)
    res.status(500).send()
  }

  // Task.findById(_id).then(task => {
  //   if(!task) {
  //     return res.status(404).send()
  //   }
  //   res.send(task)
  // }).catch(e => {
  //   res.status(500).send()
  // })
})

router.patch('/tasks/:id', auth, async (req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['description', 'completed']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user._id })
    // const task = await Task.findById(req.params.id)

    // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true,
    //   runValidators: true
    // })
    if(!task) {
      return res.status(404).send()
    }

    updates.forEach(update => task[update] = req.body[update])
    await task.save()
    res.send(task)
  } catch(e) {
    res.status(400).send(e)
  }
})

router.delete('/tasks/:id', auth, async (req, res) => {
  try {
    // const task = await Task.findByIdAndDelete(req.params.id)
    const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })

    if(!task) {
      return res.status(404).send()
    }
    res.send(task)
  } catch(e) {
    res.status(500).send()
  }
})

module.exports = router