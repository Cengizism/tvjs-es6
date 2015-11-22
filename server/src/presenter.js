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
    let alertString = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
            <alertTemplate>
              <title>${title}</title>
              <description>${description}</description>
            </alertTemplate>
          </document>`

    let parser = new DOMParser();
    let alertDoc = parser.parseFromString(alertString, 'application/xml');

    return alertDoc;
  }

  loadResource(resource, callback) {
    var self = this;

    evaluateScripts([resource], (success) => {
      if (success) {
        let resource = Template.call(self);
        callback.call(self, resource);
      } else {
        let title = "Resource Loader Error";
        let description = `There was an error attempting to load the resource '${resource}'. \n\n Please try again later.`;
        let alert = createAlert(title, description);

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
    let regExp = new RegExp(searchText, 'i');
    let matchesText = value => regExp.test(value);
    let movies = {
      'The Puffin': 1,
      'Lola and Max': 2,
      'Road to Firenze': 3,
      'Three Developers and a Baby': 4,
      'Santa Cruz Surf': 5,
      'Cinque Terre': 6,
      'Creatures of the Rainforest': 7
    };

    let titles = Object.keys(movies);
    let domImplementation = doc.implementation;
    let lsParser = domImplementation.createLSParser(1, null);
    let lsInput = domImplementation.createLSInput();

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
    let self = this;
    let doc = xml;

    this.defaultPresenter.call(this, xml);

    let searchField = doc.getElementsByTagName('searchField').item(0);
    let keyboard = searchField.getFeature('Keyboard');

    keyboard.onTextChange = () => {
      let searchText = keyboard.text;
      console.log('search text changed: ' + searchText);
      self.buildResults(doc, searchText);
    }
  }

  modalDialogPresenter(xml) {
    navigationDocument.presentModal(xml);
  }

  menuBarItemPresenter(xml, ele) {
    let feature = ele.parentNode.getFeature('MenuBarDocument');

    if (feature) {
      let currentDoc = feature.getDocument(ele);

      if (!currentDoc) {
        feature.setDocument(xml, ele);
      }
    }
  }

  load(event) {
    let self = this;
    let ele = event.target;
    let templateURL = ele.getAttribute('template');
    let presentation = ele.getAttribute('presentation');

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

    let doc = Presenter.parser.parseFromString(resource, 'application/xml');
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
