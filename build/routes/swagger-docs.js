"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _express = _interopRequireDefault(require("express"));

var _swaggerUiExpress = _interopRequireDefault(require("swagger-ui-express"));

var _swagger = _interopRequireDefault(require("../swagger.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var router = _express["default"].Router();

router.use('/', _swaggerUiExpress["default"].serve);
router.get('/', _swaggerUiExpress["default"].setup(_swagger["default"])); // router.get('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

var _default = router;
exports["default"] = _default;