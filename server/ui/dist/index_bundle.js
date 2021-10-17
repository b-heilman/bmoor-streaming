/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./index.js":
/*!******************!*\
  !*** ./index.js ***!
  \******************/
/***/ (() => {

eval("function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }\n\nfunction _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"next\", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, \"throw\", err); } _next(undefined); }); }; }\n\n// import * as d3 from 'd3';\nvar port = 9000;\n\nfunction boot() {\n  return _boot.apply(this, arguments);\n}\n\nfunction _boot() {\n  _boot = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {\n    var response, data;\n    return regeneratorRuntime.wrap(function _callee$(_context) {\n      while (1) {\n        switch (_context.prev = _context.next) {\n          case 0:\n            document.body.innerHTML = \"\\n<style>\\nbody {\\n\\tbackground: #00151c;\\n\\tmargin: 0px;\\n}\\n#dashboard {\\n\\tbackground: #0e3040;\\n\\tcolor: #67809f;\\n\\tmargin: 0px;\\n}\\n</style>\\n\\n<section id='dashboard'\\n\\tstyle='border: 1px solid black'\\n\\t>Check the console</section>\\n\";\n            _context.next = 3;\n            return fetch('http://localhost:' + port + '/read/trigger');\n\n          case 3:\n            response = _context.sent;\n            _context.next = 6;\n            return response.json();\n\n          case 6:\n            data = _context.sent;\n            console.log('data received:', data.results.length);\n\n          case 8:\n          case \"end\":\n            return _context.stop();\n        }\n      }\n    }, _callee);\n  }));\n  return _boot.apply(this, arguments);\n}\n\nconsole.log('ready to roll..');\nboot();\n\n//# sourceURL=webpack:///./index.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./index.js"]();
/******/ 	
/******/ })()
;