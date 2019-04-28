"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _default = function _default(req, res) {
  return res.status(404).json({
    status: 404,
    error: 'Invalid Endpoint'
  });
};

exports["default"] = _default;