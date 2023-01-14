const express = require('express');

const router = express.Router();

//route hello
router.get('/hello',(req, res)=>{
    res.send('hello');
});

module.exports = router;