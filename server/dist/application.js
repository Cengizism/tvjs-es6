/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	var _controller = __webpack_require__(1);
	
	var _controller2 = _interopRequireDefault(_controller);
	
	App.onLaunch = function (options) {
	  var controller = new _controller2['default'](options.TVBaseURL);
	  var path = options.TVBaseURL + 'templates/Index.xml.js';
	
	  var index = controller.loadResource(path, function (resource) {
	    var doc = controller.dom.parse(resource);
	    doc.addEventListener('select', controller.load.bind(controller));
	    navigationDocument.pushDocument(doc);
	  });
	};
	
	App.reload = function (options, reloadData) {
	  console.log('Application reloaded with:', options, reloadData);
	};
	
	App.onError = function (options) {
	  console.error('Application stopped working because of;', options);
	};
	
	App.onExit = function (options) {
	  console.log('Quitting application.');
	};

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _partials = __webpack_require__(2);
	
	var _partials2 = _interopRequireDefault(_partials);
	
	var _Template = __webpack_require__(5);
	
	var _Template2 = _interopRequireDefault(_Template);
	
	var _dom = __webpack_require__(3);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var _search = __webpack_require__(4);
	
	var _search2 = _interopRequireDefault(_search);
	
	var Controller = (function () {
	  function Controller(TVBaseURL) {
	    _classCallCheck(this, Controller);
	
	    if (!TVBaseURL) {
	      throw 'Controller: TVBaseURL is required.';
	    }
	    this.TVBaseURL = TVBaseURL;
	
	    this.dom = new _dom2['default']();
	    this.template = new _Template2['default']();
	
	    this.search = new _search2['default'](TVBaseURL);
	  }
	
	  _createClass(Controller, [{
	    key: 'createAlert',
	    value: function createAlert(alert) {
	      return this.dom.parse(this.template.engine(_partials2['default'].alertBody, alert));
	    }
	  }, {
	    key: 'loadResource',
	    value: function loadResource(resource, callback) {
	      var _this = this;
	
	      evaluateScripts([resource], function (success) {
	        if (success) {
	          callback.call(_this, Content.call(_this));
	        } else {
	          var _alert = {
	            title: 'Resource Loader Error',
	            description: 'There was an error attempting to load the resource \'' + resource + '\'. \n\n Please try again later.'
	          };
	
	          _this.removeLoadingIndicator();
	          navigationDocument.presentModal(_this.createAlert(_alert));
	        }
	      });
	    }
	  }, {
	    key: 'defaultPresenter',
	    value: function defaultPresenter(template) {
	      if (this.loadingIndicatorVisible) {
	        navigationDocument.replaceDocument(template, this.loadingIndicator);
	
	        this.loadingIndicatorVisible = false;
	      } else {
	        navigationDocument.pushDocument(template);
	      }
	    }
	  }, {
	    key: 'searchPresenter',
	    value: function searchPresenter(doc) {
	      var _this2 = this;
	
	      this.defaultPresenter.call(this, doc);
	
	      var searchField = doc.getElementsByTagName('searchField').item(0);
	      var keyboard = searchField.getFeature('Keyboard');
	
	      keyboard.onTextChange = function () {
	        return _this2.search.buildResults(doc, keyboard.text);
	      };
	    }
	  }, {
	    key: 'modalDialogPresenter',
	    value: function modalDialogPresenter(template) {
	      navigationDocument.presentModal(template);
	    }
	  }, {
	    key: 'menuBarItemPresenter',
	    value: function menuBarItemPresenter(template, element) {
	      var feature = element.parentNode.getFeature('MenuBarDocument');
	
	      if (feature) {
	        var currentDoc = feature.getDocument(element);
	
	        if (!currentDoc) {
	          feature.setDocument(template, element);
	        }
	      }
	    }
	  }, {
	    key: 'load',
	    value: function load(event) {
	      var _this3 = this;
	
	      var element = event.target;
	      var templateURL = element.getAttribute('template');
	      var presentation = element.getAttribute('presentation');
	
	      if (templateURL) {
	        this.showLoadingIndicator(presentation);
	
	        this.loadResource(templateURL, function (resource) {
	          if (resource) {
	            var doc = _this3.dom.parse(resource);
	
	            doc.addEventListener('select', _this3.load.bind(_this3));
	            doc.addEventListener('highlight', _this3.load.bind(_this3));
	
	            if (_this3[presentation] instanceof Function) {
	              _this3[presentation].call(_this3, doc, element);
	            } else {
	              _this3.defaultPresenter.call(_this3, doc);
	            }
	          }
	        });
	      }
	    }
	  }, {
	    key: 'showLoadingIndicator',
	    value: function showLoadingIndicator(presentation) {
	      if (!this.loadingIndicator) {
	        this.loadingIndicator = this.dom.parse(_partials2['default'].loadingTemplate);
	      }
	
	      if (!this.loadingIndicatorVisible && presentation != 'modalDialogPresenter' && presentation != 'menuBarItemPresenter') {
	        navigationDocument.pushDocument(this.loadingIndicator);
	
	        this.loadingIndicatorVisible = true;
	      }
	    }
	  }, {
	    key: 'removeLoadingIndicator',
	    value: function removeLoadingIndicator() {
	      if (this.loadingIndicatorVisible) {
	        navigationDocument.removeDocument(this.loadingIndicator);
	
	        this.loadingIndicatorVisible = false;
	      }
	    }
	  }]);
	
	  return Controller;
	})();
	
	exports['default'] = Controller;
	module.exports = exports['default'];

/***/ },
/* 2 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var partials = {};
	
	partials.loadingTemplate = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n                              <document>\n                                <loadingTemplate>\n                                  <activityIndicator>\n                                    <text>Loading...</text>\n                                  </activityIndicator>\n                                </loadingTemplate>\n                              </document>";
	
	partials.alertBody = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n                        <document>\n                          <alertTemplate>\n                            <title>{{title}}</title>\n                            <description>{{description}}</description>\n                          </alertTemplate>\n                        </document>";
	
	exports["default"] = partials;
	module.exports = exports["default"];

/***/ },
/* 3 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Dom = (function () {
	  function Dom() {
	    _classCallCheck(this, Dom);
	
	    this.parser = new DOMParser();
	  }
	
	  _createClass(Dom, [{
	    key: 'parse',
	    value: function parse(body) {
	      return this.parser.parseFromString(body, 'application/xml');
	    }
	  }, {
	    key: 'replace',
	    value: function replace(data, target, doc) {
	      var domImplementation = doc.implementation;
	      var lsParser = domImplementation.createLSParser(1, null);
	      var lsInput = domImplementation.createLSInput();
	
	      lsInput.stringData = data;
	
	      lsParser.parseWithContext(lsInput, doc.getElementsByTagName(target).item(0), 2);
	    }
	  }]);
	
	  return Dom;
	})();
	
	exports['default'] = Dom;
	module.exports = exports['default'];

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var _dom = __webpack_require__(3);
	
	var _dom2 = _interopRequireDefault(_dom);
	
	var movies = {
	  'The Puffin': 1,
	  'Lola and Max': 2,
	  'Road to Firenze': 3,
	  'Three Developers and a Baby': 4,
	  'Santa Cruz Surf': 5,
	  'Cinque Terre': 6,
	  'Creatures of the Rainforest': 7
	};
	
	var Search = (function () {
	  function Search(TVBaseURL) {
	    _classCallCheck(this, Search);
	
	    this.TVBaseURL = TVBaseURL;
	
	    this.Dom = new _dom2['default']();
	  }
	
	  _createClass(Search, [{
	    key: 'buildResults',
	    value: function buildResults(doc, searchText) {
	      var regExp = new RegExp(searchText, 'i');
	      var matchesText = function matchesText(value) {
	        return regExp.test(value);
	      };
	
	      var titles = Object.keys(movies);
	
	      var stringData = '<list>\n            <section>\n              <header>\n                <title>No Results</title>\n              </header>\n            </section>\n          </list>';
	
	      titles = searchText ? titles.filter(matchesText) : titles;
	
	      if (titles.length > 0) {
	        stringData = '<shelf><header><title>Results</title></header><section id="Results">';
	
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = titles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var title = _step.value;
	
	            stringData += '<lockup>\n              <img src="' + this.TVBaseURL + 'resources/images/movies/movie_' + movies[title] + '.lcr" width="350" height="520" />\n              <title>' + title + '</title>\n            </lockup>';
	          }
	        } catch (err) {
	          _didIteratorError = true;
	          _iteratorError = err;
	        } finally {
	          try {
	            if (!_iteratorNormalCompletion && _iterator['return']) {
	              _iterator['return']();
	            }
	          } finally {
	            if (_didIteratorError) {
	              throw _iteratorError;
	            }
	          }
	        }
	
	        stringData += '</section></shelf>';
	      }
	
	      this.Dom.replace(stringData, 'collectionList', doc);
	    }
	  }]);
	
	  return Search;
	})();
	
	exports['default'] = Search;
	module.exports = exports['default'];

/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var Template = (function () {
	  function Template() {
	    _classCallCheck(this, Template);
	
	    this.cache = {};
	  }
	
	  _createClass(Template, [{
	    key: "engine",
	    value: function engine(template, data) {
	      var fn = !/\W/.test(template) ? this.cache[template] = cache[template] : new Function('obj', "var p=[],print=function(){p.push.apply(p,arguments);};" + "with(obj){p.push('" + template.replace(/[\r\t\n]/g, ' ').split('{{').join('\t').replace(/((^|\}\})[^\t]*)'/g, '$1\r').replace(/\t(.*?)\}\}/g, "',$1,'").split('\t').join("');").split('}}').join("p.push('").split('\r').join("\\'") + "');}return p.join('');");
	
	      return data ? fn(data) : fn;
	    }
	  }]);
	
	  return Template;
	})();
	
	exports["default"] = Template;
	module.exports = exports["default"];

/***/ }
/******/ ]);
//# sourceMappingURL=application.js.map