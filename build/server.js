"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

require("@babel/polyfill");

var _express = _interopRequireDefault(require("express"));

var _methodOverride = _interopRequireDefault(require("method-override"));

var _morgan = _interopRequireDefault(require("morgan"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _expressValidator = _interopRequireDefault(require("express-validator"));

var _index = _interopRequireDefault(require("./routes/index"));

var _catchall = _interopRequireDefault(require("./routes/catchall"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

/* -------- ROUTES ---------------- */
_dotenv["default"].config();

var app = (0, _express["default"])();

if (process.env.NODE_ENV !== 'test') {
  app.use((0, _morgan["default"])('combined'));
}

app.use((0, _methodOverride["default"])());
app.use(_express["default"].json());
app.use(_express["default"].urlencoded());
app.use((0, _expressValidator["default"])());
app.use("/api/".concat(process.env.API_VERSION), _index["default"]);
app.use('*', _catchall["default"]);
var server = app.listen(process.env.PORT, function () {
  var _server$address = server.address(),
      address = _server$address.address,
      port = _server$address.port;

  console.log("Your app is listening on ".concat(address, " at port ").concat(port));
});
var _default = server;
exports["default"] = _default;