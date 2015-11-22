import Controller from './controller';

App.onLaunch = function(options) {
  let controller = new Controller(options.TVBaseURL);
  let path = `${options.TVBaseURL}templates/Index.xml.js`;

  var index = controller.loadResource(path, resource => {
    let doc = controller.domHelper.parse(resource);
    doc.addEventListener('select', controller.load.bind(controller));
    navigationDocument.pushDocument(doc);
  });
};

App.reload = function(options, reloadData) {
  console.log('Application reloaded with:', options, reloadData);
};

App.onError = function (options) {
  console.error('Application stopped working because of;', options);
};

App.onExit = function (options) {
  console.log('Quitting application.');
};
