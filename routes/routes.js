const express = require('express');

const app = express();

app.use(require('./users'));
app.use(require('./login'));
app.use(require('./politicalParty'));
app.use(require('./participationPeriod'));
app.use(require('./candidate'));
app.use(require('./votingCenter'));
app.use(require('./table'));
app.use(require('./rangeTable'));
app.use(require('./politicalProfile'));
app.use(require('./votingControl'));

module.exports = app;