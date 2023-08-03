const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
app.use(express.json())
app.use(express.static('build'))
app.use(cors())

morgan.token('data', (req, res) => {
  return JSON.stringify(req.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  console.log('getting', id)
  const person = persons.find(person => person.id === id)
  if (!person) {
    res.status(404).end()
    return
  }

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id !== id)

  res.status(204).end()
})

app.post('/api/persons', (req, res) => {
  const body = req.body

  if (!body.name || !body.number) {
    res.status(400).json({
      error: 'content missing'
    })
    return
  }
  
  if (persons.find(person => person.name === body.name)) {
    res.status(400).json({
      error: 'name has already been added to phonebook'
    })
    return
  }
  
  const randomId = Math.floor(Math.random() * 1000)
  const person = {
    id: randomId,
    name: body.name,
    number: body.number,
  }
  persons = persons.concat(person)
  res.json(persons)
})

app.get('/info', (req, res) => {
  const date = new Date()
  const time = date.toString()
  res.send(`<div>Phonebook has info for ${persons.length} people</div></br><div>${time}</div>`)
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))