import Presenter from './presenter';

App.onLaunch = function(options) {
  let presenter = new Presenter(options.BASEURL);
  let path = `${options.BASEURL}templates/Index.xml.js`;

  var index = presenter.loadResource(path, (resource) => {
    let doc = presenter.makeDocument(resource);
    doc.addEventListener('select', presenter.load.bind(presenter));
    navigationDocument.pushDocument(doc);
  });
}
