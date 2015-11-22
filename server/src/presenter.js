class Presenter {
  constructor(baseurl) {
    if (!baseurl) {
      throw ("ResourceLoader: baseurl is required.");
    }
    this.BASEURL = baseurl;

    this.loadingTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
            <document>
              <loadingTemplate>
                <activityIndicator>
                  <text>Loading...</text>
                </activityIndicator>
              </loadingTemplate>
            </document>`;
  }

  createAlert(title, description) {
    var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
            <alertTemplate>
              <title>${title}</title>
              <description>${description}</description>
            </alertTemplate>
          </document>`

    var parser = new DOMParser(),
      alertDoc = parser.parseFromString(alertString, 'application/xml');

    return alertDoc;
  }

  loadResource(resource, callback) {
    var self = this;

    evaluateScripts([resource], (success) => {
      if (success) {
        var resource = Template.call(self);
        callback.call(self, resource);
      } else {
        var title = "Resource Loader Error",
          description = `There was an error attempting to load the resource '${resource}'. \n\n Please try again later.`,
          alert = createAlert(title, description);

        Presenter.removeLoadingIndicator();

        navigationDocument.presentModal(alert);
      }
    });
  }

  defaultPresenter(xml) {
    if (this.loadingIndicatorVisible) {
      navigationDocument.replaceDocument(xml, this.loadingIndicator);

      this.loadingIndicatorVisible = false;
    } else {
      navigationDocument.pushDocument(xml);
    }
  }

  buildResults(doc, searchText) {
    var regExp = new RegExp(searchText, 'i');

    var matchesText = (value) => {
      return regExp.test(value);
    }

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

    lsInput.stringData = `<list>
        <section>
          <header>
            <title>No Results</title>
          </header>
        </section>
      </list>`;

    titles = (searchText) ? titles.filter(matchesText) : titles;

    if (titles.length > 0) {
      lsInput.stringData = `<shelf><header><title>Results</title></header><section id="Results">`;

      for (let title of titles) {
        lsInput.stringData += `<lockup>
            <img src="${this.BASEURL}resources/images/movies/movie_${movies[title]}.lcr" width="350" height="520" />
            <title>${title}</title>
          </lockup>`;
      }

      lsInput.stringData += `</section></shelf>`;
    }

    lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);
  }

  searchPresenter(xml) {
    var self = this;
    this.defaultPresenter.call(this, xml);
    var doc = xml;

    var searchField = doc.getElementsByTagName('searchField').item(0);
    var keyboard = searchField.getFeature('Keyboard');

    keyboard.onTextChange = () => {
      var searchText = keyboard.text;
      //console.log('search text changed: ' + searchText);
      self.buildResults(doc, searchText);
    }
  }

  modalDialogPresenter(xml) {
    navigationDocument.presentModal(xml);
  }

  menuBarItemPresenter(xml, ele) {
    var feature = ele.parentNode.getFeature('MenuBarDocument');

    if (feature) {
      var currentDoc = feature.getDocument(ele);

      if (!currentDoc) {
        feature.setDocument(xml, ele);
      }
    }
  }

  load(event) {
    var self = this,
      ele = event.target,
      templateURL = ele.getAttribute('template'),
      presentation = ele.getAttribute('presentation');

    if (templateURL) {
      self.showLoadingIndicator(presentation);

      this.loadResource(templateURL, (resource) => {
        if (resource) {
          var doc = self.makeDocument(resource);

          doc.addEventListener('select', self.load.bind(self));
          doc.addEventListener('highlight', self.load.bind(self));

          if (self[presentation] instanceof Function) {
            self[presentation].call(self, doc, ele);
          } else {
            self.defaultPresenter.call(self, doc);
          }
        }
      });
    }
  }

  makeDocument(resource) {
    if (!Presenter.parser) {
      Presenter.parser = new DOMParser();
    }

    var doc = Presenter.parser.parseFromString(resource, 'application/xml');
    return doc;
  }

  showLoadingIndicator(presentation) {
    if (!this.loadingIndicator) {
      this.loadingIndicator = this.makeDocument(this.loadingTemplate);
    }

    if (!this.loadingIndicatorVisible && presentation != 'modalDialogPresenter' && presentation != 'menuBarItemPresenter') {
      navigationDocument.pushDocument(this.loadingIndicator);

      this.loadingIndicatorVisible = true;
    }
  }

  removeLoadingIndicator() {
    if (this.loadingIndicatorVisible) {
      navigationDocument.removeDocument(this.loadingIndicator);

      this.loadingIndicatorVisible = false;
    }
  }
}

export default Presenter;
