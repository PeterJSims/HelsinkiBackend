require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const Person = require('./models/person');

morgan.token('body', (req) => JSON.stringify(req.body));

app.use(express.static('build'));
app.use(bodyParser.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

// const generateId = () => {
// 	return Math.floor(Math.random() * 50000);
// };

let persons = [
	{
		name: 'Arto Hellas',
		number: '040-123456',
		id: 1
	},
	{
		name: 'Ada Lovelace',
		number: '39-44-5323523',
		id: 2
	},
	{
		name: 'Dan Abramov',
		number: '12-43-234345',
		id: 3
	},
	{
		name: 'Mary Poppendieck',
		number: '39-23-6423122',
		id: 4
	}
];

app.get('/info', (req, res) => {
	res.send(`
    <div>
    Phonebook has info for ${persons.length} people
    </div>
    <br>
    <div>
    ${Date()}
    </div>`);
});

app.get('/api/persons', (req, res) => {
	Person.find({}).then((persons) => {
		res.json(persons.map((person) => person.toJSON()));
	});
});

app.get('/api/persons/:id', (req, res) => {
	Person.findById(req.params.id).then((person) => {
		res.json(person.toJSON());
	});
});

app.post('/api/persons', (req, res) => {
	const body = req.body;
	if (!body.name) {
		return res.status(400).json({ error: 'content missing' });
	}
	if (persons.some((person) => person.name === body.name)) {
		return res.status(400).json({ error: 'entry already exists' });
	}

	const person = new Person({
		name: body.name,
		number: body.number
	});
	person.save().then((savedPerson) => {
		res.json(savedPerson.toJSON());
	});
});

app.delete('/api/persons/:id', (req, res) => {
	let id = Number(req.params.id);

	persons = persons.filter((person) => person.id !== id);

	res.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
