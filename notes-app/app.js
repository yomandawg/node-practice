const chalk = require('chalk')
const yargs = require('yargs')
const notes = require('./notes')

yargs.version('1.1.0')

yargs.command({
  command: 'get',
  describe: 'Get notes',
  handler() {
    notes.getNotes()
  }
})

yargs.command({
  command: 'add',
  describe: 'add a new note',
  builder: {
    title: {
      describe: chalk.inverse.green('Note title'),
      demandOption: true,
      type: 'string'
    },
    body: {
      describe: chalk.inverse.blue('Note body'),
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.addNote(argv.title, argv.body)
  }
})

yargs.command({
  command: 'remove',
  describe: 'Remove a note',
  builder: {
    title: {
      describe: chalk.inverse.green('Note title'),
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.removeNote(argv.title)
  }
})

yargs.command({
  command: 'list',
  describe: 'List all notes',
  handler() {
    notes.listNotes()
  }
})

yargs.command({
  command: 'read',
  describe: 'Read a note',
  builder: {
    title: {
      describe: 'Note title',
      demandOption: true,
      type: 'string'
    }
  },
  handler(argv) {
    notes.readNote(argv.title)
  }
})

yargs.parse()