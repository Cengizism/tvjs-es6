import Dom from './dom';

class Presenter extends Dom {
  constructor(baseurl) {
    super();

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

  createAlert(alert) {
    let body = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
            <alertTemplate>
              <title>${alert.title}</title>
              <description>${alert.description}</description>
            </alertTemplate>
          </document>`

    return super.domParser(body);
  }

  loadResource(resource, callback) {
    evaluateScripts([resource], (success) => {
      if (success) {
        callback.call(this, Template.call(this));
      } else {
        let alert = {
          title: 'Resource Loader Error',
          description: `There was an error attempting to load the resource '${resource}'. \n\n Please try again later.`
        };

        Presenter.removeLoadingIndicator();
        navigationDocument.presentModal( createAlert(alert) );
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

    let stringData = `<list>
          <section>
            <header>
              <title>No Results</title>
            </header>
          </section>
        </list>`;

    titles = (searchText) ? titles.filter(matchesText) : titles;

    if (titles.length > 0) {
      stringData = `<shelf><header><title>Results</title></header><section id="Results">`;

      for (let title of titles) {
        stringData += `<lockup>
            <img src="${this.BASEURL}resources/images/movies/movie_${movies[title]}.lcr" width="350" height="520" />
            <title>${title}</title>
          </lockup>`;
      }

      stringData += `</section></shelf>`;
    }

    super.domReplacer(stringData, 'collectionList', doc);
  }

  searchPresenter(xml) {
    this.defaultPresenter.call(this, xml);

    let doc = xml;
    let searchField = doc.getElementsByTagName('searchField').item(0);
    let keyboard = searchField.getFeature('Keyboard');

    keyboard.onTextChange = () => {
      let searchText = keyboard.text;
      console.log('search text changed: ' + searchText);
      this.buildResults(doc, searchText);
    }
  }

  modalDialogPresenter(xml) {
    navigationDocument.presentModal(xml);
  }

  menuBarItemPresenter(xml, element) {
    let feature = element.parentNode.getFeature('MenuBarDocument');

    if (feature) {
      let currentDoc = feature.getDocument(element);

      if (!currentDoc) {
        feature.setDocument(xml, element);
      }
    }
  }

  load(event) {
    let element = event.target;
    let templateURL = element.getAttribute('template');
    let presentation = element.getAttribute('presentation');

    if (templateURL) {
      this.showLoadingIndicator(presentation);

      this.loadResource(templateURL, (resource) => {
        if (resource) {
          var doc = this.makeDocument(resource);

          doc.addEventListener('select', this.load.bind(this));
          doc.addEventListener('highlight', this.load.bind(this));

          if (this[presentation] instanceof Function) {
            this[presentation].call(this, doc, element);
          } else {
            this.defaultPresenter.call(this, doc);
          }
        }
      });
    }
  }

  makeDocument(resource) {
    if (!Presenter.parser) {
      Presenter.parser = new DOMParser();
    }

    return Presenter.parser.parseFromString(resource, 'application/xml');
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
