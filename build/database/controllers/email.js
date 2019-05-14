"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _nodemailer = _interopRequireDefault(require("nodemailer"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var transporter = _nodemailer["default"].createTransport({
  service: process.env.MAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL_ACCOUNT,
    pass: process.env.PASSWORD
  }
});

var EmailController =
/*#__PURE__*/
function () {
  function EmailController() {
    _classCallCheck(this, EmailController);
  }

  _createClass(EmailController, null, [{
    key: "testMail",
    value: function testMail(req, res) {
      var mailOptions = {
        from: 'noreply@precioustosin.github.io',
        // sender address
        to: 'precioustosin@hotmail.com',
        // list of receivers
        subject: 'Testing email functtionality with Nodemailer',
        // Subject line
        html: '<strong>and easy to do anywhere, even with Node.js</strong>' // plain text body

      };
      transporter.sendMail(mailOptions).then(function (info) {
        res.status(200).json({
          status: 200,
          data: {
            msg: 'email sent',
            data: info
          }
        });
      })["catch"](function (error) {
        res.status(400).json({
          status: 400,
          error: error
        });
      });
    }
  }, {
    key: "sendMail",
    value: function sendMail(mailOptions) {
      return new Promise(function (resolve, reject) {
        return transporter.sendMail(mailOptions).then(function (info) {
          return resolve(info);
        })["catch"](function (error) {
          return reject(error);
        });
      });
    }
  }]);

  return EmailController;
}();

var _default = EmailController;
exports["default"] = _default;