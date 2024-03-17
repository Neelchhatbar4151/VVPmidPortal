//Dependencies
const App = require("express")();

const RegisterRoutes = require("./registerRoute");
const LoginRoutes = require("./loginRoute");
const DataRoutes = require("./dataRoute");

App.use(RegisterRoutes);
App.use(LoginRoutes);
App.use(DataRoutes);

module.exports = App;
