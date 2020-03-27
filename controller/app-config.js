const express = require('express');
const router = express.Router();

var broadcastMessage = 'Site is under construction. Please check later!'

// Return the Broadcast message
router.get('/broadcast-message', (req, res) => {

    console.log('GET /broadcast-message: ', req.body);

    res.send({
        broadcastMessage
    });
});

// Update the Broadcast Message
router.put('/broadcast-message', (req, res) => {

    console.log('PUT /broadcast-message: ', req.body);

    broadcastMessage = req.body.broadcastMessage;
    res.send({
        broadcastMessage
    });

});

module.exports = router;