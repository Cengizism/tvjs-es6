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
	
	var _presenter = __webpack_require__(1);
	
	var _presenter2 = _interopRequireDefault(_presenter);
	
	App.onLaunch = function (options) {
	  var presenter = new _presenter2['default'](options.BASEURL);
	  var path = options.BASEURL + 'templates/Index.xml.js';
	
	  var index = presenter.loadResource(path, function (resource) {
	    var doc = presenter.makeDocument(resource);
	    doc.addEventListener('select', presenter.load.bind(presenter));
	    navigationDocument.pushDocument(doc);
	  });
	};

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, '__esModule', {
	  value: true
	});
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
	
	var Presenter = (function () {
	  function Presenter(baseurl) {
	    _classCallCheck(this, Presenter);
	
	    if (!baseurl) {
	      throw "ResourceLoader: baseurl is required.";
	    }
	    this.BASEURL = baseurl;
	
	    this.loadingTemplate = '<?xml version="1.0" encoding="UTF-8" ?>\n            <document>\n              <loadingTemplate>\n                <activityIndicator>\n                  <text>Loading...</text>\n                </activityIndicator>\n              </loadingTemplate>\n            </document>';
	  }
	
	  _createClass(Presenter, [{
	    key: 'createAlert',
	    value: function createAlert(alert) {
	      var body = '<?xml version="1.0" encoding="UTF-8" ?>\n          <document>\n            <alertTemplate>\n              <title>' + alert.title + '</title>\n              <description>' + alert.description + '</description>\n            </alertTemplate>\n          </document>';
	
	      var parser = new DOMParser();
	      return parser.parseFromString(body, 'application/xml');
	    }
	  }, {
	    key: 'loadResource',
	    value: function loadResource(resource, callback) {
	      var _this = this;
	
	      evaluateScripts([resource], function (success) {
	        if (success) {
	          callback.call(_this, Template.call(_this));
	        } else {
	          var _alert = {
	            title: 'Resource Loader Error',
	            description: 'There was an error attempting to load the resource \'' + resource + '\'. \n\n Please try again later.'
	          };
	
	          Presenter.removeLoadingIndicator();
	          navigationDocument.presentModal(createAlert(_alert));
	        }
	      });
	    }
	  }, {
	    key: 'defaultPresenter',
	    value: function defaultPresenter(xml) {
	      if (this.loadingIndicatorVisible) {
	        navigationDocument.replaceDocument(xml, this.loadingIndicator);
	
	        this.loadingIndicatorVisible = false;
	      } else {
	        navigationDocument.pushDocument(xml);
	      }
	    }
	  }, {
	    key: 'buildResults',
	    value: function buildResults(doc, searchText) {
	      var regExp = new RegExp(searchText, 'i');
	      var matchesText = function matchesText(value) {
	        return regExp.test(value);
	      };
	
	      var movies = {
	        'The Puffin': 1,
	        'Lola and Max': 2,
	        'Road to Firenze': 3,
	        'Three Developers and a Baby': 4,
	        'Santa Cruz Surf': 5,
	        'Cinque Terre': 6,
	        'Creatures of the Rainforest': 7
	      };
	      var titles = Object.keys(movies);
	
	      var domImplementation = doc.implementation;
	      var lsParser = domImplementation.createLSParser(1, null);
	      var lsInput = domImplementation.createLSInput();
	
	      lsInput.stringData = '<list>\n        <section>\n          <header>\n            <title>No Results</title>\n          </header>\n        </section>\n      </list>';
	
	      titles = searchText ? titles.filter(matchesText) : titles;
	
	      if (titles.length > 0) {
	        lsInput.stringData = '<shelf><header><title>Results</title></header><section id="Results">';
	
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;
	
	        try {
	          for (var _iterator = titles[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	            var title = _step.value;
	
	            lsInput.stringData += '<lockup>\n            <img src="' + this.BASEURL + 'resources/images/movies/movie_' + movies[title] + '.lcr" width="350" height="520" />\n            <title>' + title + '</title>\n          </lockup>';
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
	
	        lsInput.stringData += '</section></shelf>';
	      }
	
	      lsParser.parseWithContext(lsInput, doc.getElementsByTagName('collectionList').item(0), 2);
	    }
	  }, {
	    key: 'searchPresenter',
	    value: function searchPresenter(xml) {
	      var _this2 = this;
	
	      this.defaultPresenter.call(this, xml);
	
	      var doc = xml;
	      var searchField = doc.getElementsByTagName('searchField').item(0);
	      var keyboard = searchField.getFeature('Keyboard');
	
	      keyboard.onTextChange = function () {
	        var searchText = keyboard.text;
	        console.log('search text changed: ' + searchText);
	        _this2.buildResults(doc, searchText);
	      };
	    }
	  }, {
	    key: 'modalDialogPresenter',
	    value: function modalDialogPresenter(xml) {
	      navigationDocument.presentModal(xml);
	    }
	  }, {
	    key: 'menuBarItemPresenter',
	    value: function menuBarItemPresenter(xml, element) {
	      var feature = element.parentNode.getFeature('MenuBarDocument');
	
	      if (feature) {
	        var currentDoc = feature.getDocument(element);
	
	        if (!currentDoc) {
	          feature.setDocument(xml, element);
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
	            var doc = _this3.makeDocument(resource);
	
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
	    key: 'makeDocument',
	    value: function makeDocument(resource) {
	      if (!Presenter.parser) {
	        Presenter.parser = new DOMParser();
	      }
	
	      return Presenter.parser.parseFromString(resource, 'application/xml');
	    }
	  }, {
	    key: 'showLoadingIndicator',
	    value: function showLoadingIndicator(presentation) {
	      if (!this.loadingIndicator) {
	        this.loadingIndicator = this.makeDocument(this.loadingTemplate);
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
	
	  return Presenter;
	})();
	
	exports['default'] = Presenter;
	module.exports = exports['default'];

/***/ }
/******/ ]);
//# sourceMappingURL=application.js.map