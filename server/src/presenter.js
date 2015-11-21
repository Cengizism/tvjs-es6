import ResourceLoader from './resource-loader';

class Presenter {
  constructor() {
    this.loadingTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
          <document>
            <loadingTemplate>
              <activityIndicator>
                <text>Loading...</text>
              </activityIndicator>
            </loadingTemplate>
          </document>`
  }

  defaultPresenter(xml) {
    if (this.loadingIndicatorVisible) {
      navigationDocument.replaceDocument(xml, this.loadingIndicator);

      this.loadingIndicatorVisible = false;
    } else {
      navigationDocument.pushDocument(xml);
    }
  }

  searchPresenter(xml) {
    this.defaultPresenter.call(this, xml);
    var doc = xml;

    var searchField = doc.getElementsByTagName('searchField').item(0);
    var keyboard = searchField.getFeature('Keyboard');

    keyboard.onTextChange = function() {
      var searchText = keyboard.text;
      //console.log('search text changed: ' + searchText);
      buildResults(doc, searchText);
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

      let resourceLoader = new ResourceLoader(localStorage.getItem('baseurl'));

      resourceLoader.loadResource(templateURL,
        function(resource) {
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
        }
      );
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
