//Dependencies
const App = require("express")();

const RegisterRoutes = require("./registerRoute");
const LoginRoutes = require("./loginRoute");

App.use(RegisterRoutes);
App.use(LoginRoutes);

module.exports = App;
