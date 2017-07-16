const express = require('express');
const application = require('./application.js');

console.log('server started on 3000');
application.listen(3000);