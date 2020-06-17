const express = require('express')
const multer = require('multer')
const User = require('../models/user')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/users', async (req, res) => {
  const user = new User(req.body)
  try {
    await user.save()
    const token = await user.generateAuthToken()
    res.status(201).send({ user, token })
  } catch(e) {
    res.status(400).send(e)
  }

  // user.save().then(() => {
  //   res.status(201).send(user)
  // }).catch(e => {
  //   res.status(400).send(e) // method chaining
  // })
})

router.post('/users/login', async (req, res) => {
  try {
    const user = await User.findByCredentials(req.body.email, req.body.password)
    const token = await user.generateAuthToken()
    res.send({ user, token })
  } catch(e) {
    res.status(400).send()
  }
})

router.post('/users/logout', auth, async (req, res) => {
  try {
    // remove current request token (leave all other tokens)
    req.user.tokens = req.user.tokens.filter(token => {
      return token.token !== req.token
    })
    await req.user.save()
    res.send()
  } catch(e) {
    res.status(500).send()
  }
})

router.post('/users/logoutAll', auth, async (req, res) => {
  try {
    req.user.tokens = []
    await req.user.save()
    res.send()
  } catch(e) {
    res.status(500).send()
  }
})

router.get('/users/me', auth, async (req, res) => {
  res.send(req.user)
})

// router.get('/users', auth, async (req, res) => {
//   try {
//     const users = await User.find({})
//     res.send(users)
//   } catch(e) {
//     res.status(500).send()
//   }
  
//   // User.find({}).then((users) => {
//   //   res.send(users)
//   // }).catch(e => {
//   //   res.status(500).send()
//   // })
// })

// router.get('/users/:id', async (req, res) => {
//   const _id = req.params.id

//   try {
//     const user = await User.findById(_id)
//     if(!user) {
//       return res.status(404).send()
//     }
//     res.send(user)
//   } catch(e) {
//     res.status(500).send()
//   }

//   // User.findById(_id).then(user => {
//   //   if(!user) {
//   //     return res.status(404).send()
//   //   }
//   //   res.send(user)
//   // }).catch(e => {
//   //   res.status(500).send()
//   // })
// })

// router.patch('/users/:id', async (req, res) => {
//   const updates = Object.keys(req.body) // returns an array of keys
//   const allowedUpdates = ['name', 'email', 'password', 'age']
//   // runs the callback function for every item in the array
//   const isValidOperation = updates.every(update => allowedUpdates.includes(update))

//   // error handling
//   if(!isValidOperation) {
//     return res.status(400).send({ error: 'Invalid updates!' })
//   }

//   try {
//     // dynamic updating to make use of the middleware for 'save' operation
//     const user = await User.findById(req.params.id)
//     updates.forEach(update => user[update] = req.body[update])
//     await user.save()

//     // any properties in `req.body` that are non-exist in the data model will be ignored
//     // or else: error handling with `isValidOperation`
//     // const user = await User.findByIdAndUpdate(req.params.id, req.body, {
//     //   new: true, // return new user instead of the one before
//     //   runValidators: true // validate the new data
//     // })
//     if(!user) {
//       return res.status(404).send()
//     }
//     res.send(user)
//   } catch(e) {
//     res.status(400).send(e)
//   }
// })

router.patch('/users/me', auth, async(req, res) => {
  const updates = Object.keys(req.body)
  const allowedUpdates = ['name', 'email', 'password', 'age']
  const isValidOperation = updates.every(update => allowedUpdates.includes(update))

  if(!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' })
  }

  try {
    updates.forEach(update => req.user[update] = req.body[update])
    await req.user.save()

    res.send(req.user)
  } catch(e) {
    res.status(500).send()
  }
})

// router.delete('/users/:id', auth, async (req, res) => {
//   try {
//     const user = await User.findByIdAndDelete(req.params.id)
//     console.log(user)
//     if(!user) {
//       return res.status(404).send()
//     }
//     res.send(user)
//   } catch(e) {
//     res.status(500).send()
//   }
// })

router.delete('/users/me', auth, async (req, res) => {
  try {
    await req.user.remove()
    res.send(req.user)
  } catch(e) {
    res.status(500).send()
  }
})

const upload = multer({
  dest: 'avatars',
  limits: {
    fileSize: 1000000 // 1MB
  },
  fileFilter(req, file, cb) {
    if(!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Please upload an image.'))
    }
    cb(undefined, true)
  }
})

router.post('/users/me/avatar', auth, upload.single('avatar'), (req, res) => {
  res.send()
}, (error, req, res, next) => {
  res.status(400).send({ error: error.message })
})

module.exports = router