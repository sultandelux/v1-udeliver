const express = require('express');
const router = express.Router();

router.get('/', (req,res)=>{
    res.send('Socket io Server Started, \ncheck console Log in terminal');
});


module.exports = router;