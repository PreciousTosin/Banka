"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.resetPasswordSuccessTemplate = void 0;

var resetPasswordReqTemplate = function resetPasswordReqTemplate(data) {
  return "<!DOCTYPE html>\n    <html>\n    \n    <head>\n        <title>Forget Password Email</title>\n    </head>\n    \n    <body>\n        <div>\n            <h3>Dear ".concat(data.name, ",</h3>\n            <p>You requested for a password reset, kindly use this <a href=\"").concat(data.url, "\">Change Password</a> to reset your password</p>\n            <br>\n            <p>Cheers!</p>\n        </div>\n       \n    </body>\n    \n  </html>");
};

var resetPasswordSuccessTemplate = function resetPasswordSuccessTemplate(data) {
  return "<!DOCTYPE html>\n    <html>\n    \n    <head>\n        <title>Password Reset</title>\n    </head>\n    \n    <body>\n        <div>\n            <h3>Dear ".concat(data.name, ",</h3>\n            <p>Your password has been successful reset, you can now login with your new password.</p>\n            <br>\n            <div>\n                Cheers!\n            </div>\n        </div>\n       \n    </body>\n    \n    </html>");
};

exports.resetPasswordSuccessTemplate = resetPasswordSuccessTemplate;
var _default = resetPasswordReqTemplate;
exports["default"] = _default;