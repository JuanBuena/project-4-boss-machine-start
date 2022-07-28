//  An express router provides a subset of Express methods.
const minionsRouter = require('express').Router();

//  Export router so other modules can use them
module.exports = minionsRouter;

//  Database arrays
const {
    getAllFromDatabase,
    getFromDatabaseById,
    addToDatabase,
    updateInstanceInDatabase,
    deleteFromDatabasebyId,
} = require('./db')

//  Router.param() => Function will perform the necessary lookup and attach it
//  to the req object in subsequent middleware that is run.
minionsRouter.param('minionId', (req, res, next, id) => {
    const minionIndex = getFromDatabaseById('minions', id);
    if (minionIndex) {
        req.minionIndex = minionIndex;
        next();
    } else {
        res.status(404).send('minion not found!');
    }
});

//  GET an array of all minions [/api/minions]
minionsRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('minions'));
});

//  POST to create a new minion and save it to the database
minionsRouter.post('/', (req, res, next) => {
    //  req.body contains key-value pairs of data submitted in the request body
    const newMinion = addToDatabase('minions', req.body);

    //  Status code 201 created
    if (newMinion) {
        res.status(201).send(newMinion);
    } else {
        res.status(400).send();
    }
});

//  GET a single minion by id [/api/minions/:minionId]
minionsRouter.get('/:minionId', (req, res, next) => {
    res.send(req.minionIndex);
});

//  PUT to update a single minion by id [/api/minions/:minionId]
minionsRouter.put('/:minionId', (req, res, next) => {
    const updateMinion = updateInstanceInDatabase('minions', req.body);

    // Send updated minion
    res.send(updateMinion);
});

//  DELETE a single minion by id
minionsRouter.delete('/:minionId', (req, res, next) => {
    const deleteMinion = deleteFromDatabasebyId('minions', req.params.minionId);
    
    //  Check if deletion was successful
    if (deleteMinion) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});

minionsRouter.param('workId', (req, res, next, id) => {
    const workIndex = getFromDatabaseById('work', id);
    if (workIndex) {
        req.workIndex = workIndex;
        next();
    } else {
        res.status(404).send('work not found!');
    }
});

//  GET an array of all work for the specified minion [/api/minions/:minionId/work]
minionsRouter.get('/:minionId/work', (req, res, next) => {
    const work = getAllFromDatabase('work').filter((singleWork) => {
        return singleWork.minionId === req.params.minionId;
    });
    res.send(work);
});

//  POST to create a new work object and save it to the database [/api/minions/:minionId/work]
minionsRouter.post('/:minionId/work', (req, res, next) => {
    const workToAdd = req.body;
    workToAdd.minionId = req.params.minionId;

    const newWork = addToDatabase('work', workToAdd);
    res.status(201).send(newWork);
});

//  PUT to update a single work by id [/api/minions/:minionId/work/:workId]
minionsRouter.put('/:minionId/work/:workId', (req, res, next) => {
    if (req.params.minionId === req.body.minionId) {
        const updatedWork = updateInstanceInDatabase('work', req.body);
        res.send(updatedWork);
    } else {
        res.status(400).send();
    }
});

//  DELETE a single work by id [/api/minions/:minionId/work/:workId]
minionsRouter.delete('/:minionsId/work/:workId', (req, res, next) => {
    const deletedWork = deleteFromDatabasebyId('work', req.params.workId);

    if (deletedWork) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});