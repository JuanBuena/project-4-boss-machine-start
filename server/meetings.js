const meetingsRouter = require('express').Router();

module.exports = meetingsRouter;

//  Database arrays
const {
    getAllFromDatabase,
    addToDatabase,
    deleteAllFromDatabase,
    createMeeting,
} = require('./db')

meetingsRouter.get('/', (req, res, next) => {
    res.send(getAllFromDatabase('meetings'));
});

meetingsRouter.post('/', (req, res, next) => {
    const newMeeting = addToDatabase('meetings', createMeeting());

    if (newMeeting) {
        res.status(201).send(newMeeting);
    } else {
        res.status(400).send();
    }
});

meetingsRouter.delete('/', (req, res, next) => {
    const deleteMeeting = deleteAllFromDatabase('meetings');

    if (deleteMeeting) {
        res.status(204).send();
    } else {
        res.status(404).send();
    }
});