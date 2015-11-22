import Presenter from './presenter';

App.onLaunch = function(options) {
  let presenter = new Presenter(options.BASEURL);

  var index = presenter.loadResource(`${options.BASEURL}templates/Index.xml.js`, (resource) => {
    let doc = presenter.makeDocument(resource);
    doc.addEventListener('select', presenter.load.bind(presenter));
    navigationDocument.pushDocument(doc);
  });
}
