const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET all tasks
router.get('/', taskController.getTasks);

// GET moods for a task
router.get('/moods/:task', taskController.getMoods);

// GET playlist for task + mood
router.get('/playlists/:task/:mood', taskController.getPlaylist);

module.exports = router;
