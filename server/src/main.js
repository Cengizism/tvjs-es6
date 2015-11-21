import Presenter from './presenter';

App.onLaunch = function(options) {
  var presenter = new Presenter(options.BASEURL);

  var index = presenter.loadResource(`${options.BASEURL}templates/Index.xml.js`,
    function(resource) {
      var doc = presenter.makeDocument(resource);

      doc.addEventListener('select', presenter.load.bind(presenter));

      navigationDocument.pushDocument(doc);
    });
}
