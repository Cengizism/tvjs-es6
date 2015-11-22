import partials from './partials';
import Template from './Template';
import DomHelper from './dom-helper';
import Search from './search';

class Controller {
  constructor(TVBaseURL) {
    if (!TVBaseURL) {
      throw ('Controller: TVBaseURL is required.');
    }
    this.TVBaseURL = TVBaseURL;

    this.domHelper = new DomHelper();
    this.template = new Template();

    this.search = new Search(TVBaseURL);
  }

  createAlert(alert) {
    return this.domHelper.parse(this.template.engine(partials.alertBody, alert));
  }

  loadResource(resource, callback) {
    evaluateScripts([resource], success => {
      if (success) {
        callback.call(this, Content.call(this));
      } else {
        let alert = {
          title: 'Resource Loader Error',
          description: `There was an error attempting to load the resource '${resource}'. \n\n Please try again later.`
        };

        this.removeLoadingIndicator();
        navigationDocument.presentModal(this.createAlert(alert));
      }
    });
  }

  defaultPresenter(template) {
    if (this.loadingIndicatorVisible) {
      navigationDocument.replaceDocument(template, this.loadingIndicator);

      this.loadingIndicatorVisible = false;
    } else {
      navigationDocument.pushDocument(template);
    }
  }

  searchPresenter(doc) {
    this.defaultPresenter.call(this, doc);

    let searchField = doc.getElementsByTagName('searchField').item(0);
    let keyboard = searchField.getFeature('Keyboard');

    keyboard.onTextChange = () => this.search.buildResults(doc, keyboard.text);
  }

  modalDialogPresenter(template) {
    navigationDocument.presentModal(template);
  }

  menuBarItemPresenter(template, element) {
    let feature = element.parentNode.getFeature('MenuBarDocument');

    if (feature) {
      let currentDoc = feature.getDocument(element);

      if (!currentDoc) {
        feature.setDocument(template, element);
      }
    }
  }

  load(event) {
    let element = event.target;
    let templateURL = element.getAttribute('template');
    let presentation = element.getAttribute('presentation');

    if (templateURL) {
      this.showLoadingIndicator(presentation);

      this.loadResource(templateURL, resource => {
        if (resource) {
          var doc = this.domHelper.parse(resource);

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

  showLoadingIndicator(presentation) {
    if (!this.loadingIndicator) {
      this.loadingIndicator = this.domHelper.parse(partials.loadingTemplate);
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

export default Controller;
