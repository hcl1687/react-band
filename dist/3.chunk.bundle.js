(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[3],{

/***/ 160:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(31);
/* harmony import */ var axios__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(axios__WEBPACK_IMPORTED_MODULE_0__);
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }


/* harmony default export */ __webpack_exports__["default"] = ((function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee(_ref) {
    var getComponent, constants, _ref3, JSON_SERVER, myGetStudents, myAddStudent, myDeleteStudent;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            myDeleteStudent = function _ref6(id) {
              return axios__WEBPACK_IMPORTED_MODULE_0___default.a["delete"]("".concat(JSON_SERVER, "/students/").concat(id));
            };

            myAddStudent = function _ref5(data) {
              return axios__WEBPACK_IMPORTED_MODULE_0___default.a.post("".concat(JSON_SERVER, "/students"), data);
            };

            myGetStudents = function _ref4() {
              return axios__WEBPACK_IMPORTED_MODULE_0___default.a.get("".concat(JSON_SERVER, "/students"));
            };

            getComponent = _ref.getComponent;
            _context.next = 6;
            return getComponent('contants');

          case 6:
            constants = _context.sent;
            _ref3 = constants || {}, JSON_SERVER = _ref3.JSON_SERVER;
            return _context.abrupt("return", {
              myGetStudents: myGetStudents,
              myAddStudent: myAddStudent,
              myDeleteStudent: myDeleteStudent
            });

          case 9:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function (_x) {
    return _ref2.apply(this, arguments);
  };
})());

/***/ })

}]);