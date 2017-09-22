'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ValidationError = function (_Error) {
  _inherits(ValidationError, _Error);

  function ValidationError(err, name) {
    var _ret;

    _classCallCheck(this, ValidationError);

    var _this = _possibleConstructorReturn(this, (ValidationError.__proto__ || Object.getPrototypeOf(ValidationError)).call(this, err));

    _this.err = err;
    _this.stack = false;

    _this.message = 'Validation Error\n\n' + String(name || '') + ' Invalid Options\n\n';

    err.forEach(function (msg) {
      _this.message += 'options' + String(msg.dataPath) + ' ' + String(msg.message) + '\n';
    });

    return _ret = _this, _possibleConstructorReturn(_this, _ret);
  }

  return ValidationError;
}(Error);

exports.default = ValidationError;