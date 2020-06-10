const fs = require('fs')
const chalk = require('chalk')

const getNotes = function() {
  const notes = loadNotes()
  console.log(notes)
  return notes
}

const addNote = (title, body) => {
  const notes = loadNotes()
  const duplicateNote = notes.find(note => note.title === title)
  if(!duplicateNote) {
    notes.push({ title, body })
    console.log(`New note ${chalk.bgBlue.bold(title)} added!`)
    saveNotes(notes)
  } else {
    console.log(`Note title ${chalk.bgRed.bold(title)} taken!`)
  }
}

const saveNotes = notes => {
  const dataJSON = JSON.stringify(notes)
  fs.writeFileSync('notes.json', dataJSON)
  getNotes()
}

const loadNotes = () => {
  try {
    const dataBuffer = fs.readFileSync('notes.json')
    const dataJSON = dataBuffer.toString()
    return JSON.parse(dataJSON)  
  } catch(e) {
    return []
  }
}

const removeNote = title => {
  const notes = loadNotes()
  // const notesToKeep = notes.filter(note => {
  //   if(note.title === title) {
  //     console.log(`Note title ${chalk.bgGreen.bold(title)} removed!`)
  //     return false
  //   }
  //   return true
  // })
  // saveNotes(notesToKeep)
  const notesToKeep = notes.filter(note => note.title !== title)
  if (notes.length > notesToKeep.length) {
    console.log(chalk.green.inverse('Note removed'))
    saveNotes(notesToKeep)
  } else {
    console.log(chalk.red.inverse('No note found!'))
  }
}

const listNotes = () => {
  const notes = loadNotes()
  console.log(chalk.inverse('Your notes'))
  notes.forEach(note => {
    console.log(`${note.title}: ${note.body}`)
  })    
}

const readNote = title => {
  const notes = loadNotes()
  const note = notes.find(note => note.title === title)
  if(note) {
    console.log(chalk.inverse(note.title))
    console.log(note.body)
  } else {
    console.log(chalk.red.inverse('Note not found!'))
  }
}

module.exports = {
  getNotes, addNote, removeNote, listNotes, readNote
}