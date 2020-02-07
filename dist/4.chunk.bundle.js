(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ 161:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(19);
/* harmony import */ var prop_types__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }



/* harmony default export */ __webpack_exports__["default"] = (function () {
  var _class, _temp;

  return _temp = _class = function (_Component) {
    _inherits(Test, _Component);

    function Test() {
      var _getPrototypeOf2;

      var _this;

      _classCallCheck(this, Test);

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(Test)).call.apply(_getPrototypeOf2, [this].concat(args)));

      _defineProperty(_assertThisInitialized(_this), "handleDelete", function (i) {
        _this.props.deleteItem(i);
      });

      _defineProperty(_assertThisInitialized(_this), "handleAdd", function () {
        _this.props.addItem({
          name: "he-".concat(Date.now())
        });
      });

      return _this;
    }

    _createClass(Test, [{
      key: "createList",
      value: function createList() {
        var _this2 = this;

        var _this$props$items = this.props.items,
            items = _this$props$items === void 0 ? [] : _this$props$items;
        return items.map(function (item, i) {
          return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
            key: i
          }, item.name, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
            onClick: function onClick() {
              _this2.handleDelete(i);
            }
          }, "delete"));
        });
      }
    }, {
      key: "render",
      value: function render() {
        var _this$props = this.props,
            __ = _this$props.__,
            theme = _this$props.theme;
        return react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", {
          className: theme.test
        }, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, __('test')), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, this.createList()), react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("div", null, react__WEBPACK_IMPORTED_MODULE_0___default.a.createElement("button", {
          onClick: this.handleAdd
        }, "add")));
      }
    }]);

    return Test;
  }(react__WEBPACK_IMPORTED_MODULE_0__["Component"]), _defineProperty(_class, "propTypes", {
    __: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
    theme: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.object.isRequired,
    addItem: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
    deleteItem: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.func.isRequired,
    items: prop_types__WEBPACK_IMPORTED_MODULE_1___default.a.array.isRequired
  }), _temp;
});

/***/ })

}]);