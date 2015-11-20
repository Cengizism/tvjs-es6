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
/***/ function(module, exports) {

	"use strict";
	
	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
	
	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
	
	var resourceLoader;
	
	var Presenter = {
	  defaultPresenter: function defaultPresenter(xml) {
	    if (this.loadingIndicatorVisible) {
	      navigationDocument.replaceDocument(xml, this.loadingIndicator);
	      this.loadingIndicatorVisible = false;
	    } else {
	      navigationDocument.pushDocument(xml);
	    }
	  },
	
	  searchPresenter: function searchPresenter(xml) {
	
	    this.defaultPresenter.call(this, xml);
	    var doc = xml;
	
	    var searchField = doc.getElementsByTagName("searchField").item(0);
	    var keyboard = searchField.getFeature("Keyboard");
	
	    keyboard.onTextChange = function () {
	      var searchText = keyboard.text;
	      console.log('search text changed: ' + searchText);
	      buildResults(doc, searchText);
	    };
	  },
	
	  modalDialogPresenter: function modalDialogPresenter(xml) {
	    navigationDocument.presentModal(xml);
	  },
	
	  menuBarItemPresenter: function menuBarItemPresenter(xml, ele) {
	    var feature = ele.parentNode.getFeature("MenuBarDocument");
	
	    if (feature) {
	      var currentDoc = feature.getDocument(ele);
	
	      if (!currentDoc) {
	        feature.setDocument(xml, ele);
	      }
	    }
	  },
	
	  load: function load(event) {
	    var self = this,
	        ele = event.target,
	        templateURL = ele.getAttribute("template"),
	        presentation = ele.getAttribute("presentation");
	
	    if (templateURL) {
	      self.showLoadingIndicator(presentation);
	
	      resourceLoader.loadResource(templateURL, function (resource) {
	        if (resource) {
	          var doc = self.makeDocument(resource);
	
	          doc.addEventListener("select", self.load.bind(self));
	          doc.addEventListener("highlight", self.load.bind(self));
	
	          if (self[presentation] instanceof Function) {
	            self[presentation].call(self, doc, ele);
	          } else {
	            self.defaultPresenter.call(self, doc);
	          }
	        }
	      });
	    }
	  },
	
	  makeDocument: function makeDocument(resource) {
	    if (!Presenter.parser) {
	      Presenter.parser = new DOMParser();
	    }
	
	    var doc = Presenter.parser.parseFromString(resource, "application/xml");
	    return doc;
	  },
	
	  showLoadingIndicator: function showLoadingIndicator(presentation) {
	    if (!this.loadingIndicator) {
	      this.loadingIndicator = this.makeDocument(this.loadingTemplate);
	    }
	
	    if (!this.loadingIndicatorVisible && presentation != "modalDialogPresenter" && presentation != "menuBarItemPresenter") {
	      navigationDocument.pushDocument(this.loadingIndicator);
	      this.loadingIndicatorVisible = true;
	    }
	  },
	
	  removeLoadingIndicator: function removeLoadingIndicator() {
	    if (this.loadingIndicatorVisible) {
	      navigationDocument.removeDocument(this.loadingIndicator);
	      this.loadingIndicatorVisible = false;
	    }
	  },
	
	  loadingTemplate: "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n        <document>\n          <loadingTemplate>\n            <activityIndicator>\n              <text>Loading...</text>\n            </activityIndicator>\n          </loadingTemplate>\n        </document>"
	};
	
	var ResourceLoader = (function () {
	  function ResourceLoader(baseurl) {
	    _classCallCheck(this, ResourceLoader);
	
	    if (!baseurl) {
	      throw "ResourceLoader: baseurl is required.";
	    }
	
	    this.BASEURL = baseurl;
	  }
	
	  _createClass(ResourceLoader, [{
	    key: "loadResource",
	    value: function loadResource(resource, callback) {
	      var self = this;
	
	      evaluateScripts([resource], function (success) {
	        if (success) {
	          var resource = Template.call(self);
	          callback.call(self, resource);
	        } else {
	          var title = "Resource Loader Error",
	              description = "There was an error attempting to load the resource '" + resource + "'. \n\n Please try again later.",
	              alert = createAlert(title, description);
	
	          Presenter.removeLoadingIndicator();
	
	          navigationDocument.presentModal(alert);
	        }
	      });
	    }
	  }]);
	
	  return ResourceLoader;
	})();
	
	App.onLaunch = function (options) {
	  resourceLoader = new ResourceLoader(options.BASEURL);
	  var index = resourceLoader.loadResource(options.BASEURL + "templates/Index.xml.js", function (resource) {
	    var doc = Presenter.makeDocument(resource);
	    doc.addEventListener("select", Presenter.load.bind(Presenter));
	    navigationDocument.pushDocument(doc);
	  });
	};
	
	var createAlert = function createAlert(title, description) {
	  var alertString = "<?xml version=\"1.0\" encoding=\"UTF-8\" ?>\n        <document>\n          <alertTemplate>\n            <title>" + title + "</title>\n            <description>" + description + "</description>\n          </alertTemplate>\n        </document>";
	  var parser = new DOMParser();
	  var alertDoc = parser.parseFromString(alertString, "application/xml");
	  return alertDoc;
	};
	
	var buildResults = function buildResults(doc, searchText) {
	  var regExp = new RegExp(searchText, "i");
	  var matchesText = function matchesText(value) {
	    return regExp.test(value);
	  };
	
	  var movies = {
	    "The Puffin": 1,
	    "Lola and Max": 2,
	    "Road to Firenze": 3,
	    "Three Developers and a Baby": 4,
	    "Santa Cruz Surf": 5,
	    "Cinque Terre": 6,
	    "Creatures of the Rainforest": 7
	  };
	  var titles = Object.keys(movies);
	  var domImplementation = doc.implementation;
	  var lsParser = domImplementation.createLSParser(1, null);
	  var lsInput = domImplementation.createLSInput();
	
	  lsInput.stringData = "<list>\n      <section>\n        <header>\n          <title>No Results</title>\n        </header>\n      </section>\n    </list>";
	
	  titles = searchText ? titles.filter(matchesText) : titles;
	
	  if (titles.length > 0) {
	    lsInput.stringData = "<shelf><header><title>Results</title></header><section id=\"Results\">";
	    for (var i = 0; i < titles.length; i++) {
	      lsInput.stringData += "<lockup>\n          <img src=\"" + this.resourceLoader.BASEURL + "resources/images/movies/movie_" + movies[titles[i]] + ".lcr\" width=\"350\" height=\"520\" />\n          <title>" + titles[i] + "</title>\n        </lockup>";
	    }
	    lsInput.stringData += "</section></shelf>";
	  }
	
	  lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
	
	  getMovies('http://api.themoviedb.org/3/search/movie?api_key=c8806e55322afd9062df9442a5feffec&query=' + searchText, function (response) {
	    console.log(response.results);
	  });
	};
	
	function getMovies(url, callback) {
	  var templateXHR = new XMLHttpRequest();
	  templateXHR.responseType = "document";
	  templateXHR.addEventListener("loadend", function () {
	    callback.call(this, JSON.parse(templateXHR.responseText));
	  }, false);
	  templateXHR.open('GET', url, true);
	  templateXHR.send();
	  return templateXHR;
	}

/***/ }
/******/ ]);
//# sourceMappingURL=application.js.map