const ideasRouter = require('express').Router();

module.exports = ideasRouter;

//  Database arrays
const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
} = require('./db')

const checkMillionDollarIdea = require('./checkMillionDollarIdea');

ideasRouter.param('id', (req, res, next, id) => {
    const ideasIndex = getFromDatabaseById('ideas', id);

    if (ideasIndex) {
        req.ideasIndex = ideasIndex;
        next();
    } else {
        res.status(404).send('idea not found!');
    }
});

//  GET an array of all ideas
ideasRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('ideas'));
});

//  POST to create a new idea and save it to the database
ideasRouter.post('/', checkMillionDollarIdea, (req, res, next) => {
    const newIdea = addToDatabase('ideas', req.body);

    if (newIdea) {
        res.status(201).send(newIdea);
    } else {
        res.status(400).send();
    }
    
});

//  GET a single idea by id
ideasRouter.get('/:id', (req, res, next) => {
    res.send(req.ideasIndex);
});

//  PUT to update a single idea by id
ideasRouter.put('/:id', checkMillionDollarIdea, (req, res, next) => {
    const updateIdea = updateInstanceInDatabase('ideas', req.body);

    res.send(updateIdea);
});

//  DELETE a single idea by id
ideasRouter.delete('/:id', (req, res, next) => {
    const deleteIdea = deleteFromDatabasebyId('ideas', req.params.id);

    if (deleteIdea) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});