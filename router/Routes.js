//Dependencies
const App = require("express")();

const RegisterRoutes = require("./registerRoute");
const LoginRoutes = require("./loginRoute");
const DataRoutes = require("./dataRoute");
const DeletionRoutes = require("./deletionRoute");

App.use(RegisterRoutes);
App.use(LoginRoutes);
App.use(DataRoutes);
App.use(DeletionRoutes);

module.exports = App;
