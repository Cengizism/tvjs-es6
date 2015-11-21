var resourceLoader;

import ResourceLoader from './resource-loader';
import Presenter from './presenter';

App.onLaunch = function(options) {
  localStorage.setItem('baseurl', options.BASEURL);

  resourceLoader = new ResourceLoader(options.BASEURL);

  var index = resourceLoader.loadResource(`${options.BASEURL}templates/Index.xml.js`,
    function(resource) {
      var presenter = new Presenter;
      var doc = presenter.makeDocument(resource);

      doc.addEventListener('select', presenter.load.bind(presenter));

      navigationDocument.pushDocument(doc);
    });
}

var createAlert = function(title, description) {
  var alertString = `<?xml version="1.0" encoding="UTF-8" ?>
        <document>
          <alertTemplate>
            <title>${title}</title>
            <description>${description}</description>
          </alertTemplate>
        </document>`

  var parser = new DOMParser();
  var alertDoc = parser.parseFromString(alertString, 'application/xml');

  return alertDoc;
}

var buildResults = function(doc, searchText) {
  var regExp = new RegExp(searchText, 'i');

  var matchesText = function(value) {
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

    for (var i = 0; i < titles.length; i++) {
      lsInput.stringData += `<lockup>
          <img src="${this.resourceLoader.BASEURL}resources/images/movies/movie_${movies[titles[i]]}.lcr" width="350" height="520" />
          <title>${titles[i]}</title>
        </lockup>`;
    }

    lsInput.stringData += `</section></shelf>`;
  }

  lsParser.parseWithContext(lsInput, doc.getElementsByTagName("collectionList").item(0), 2);

  getMovies('http://api.themoviedb.org/3/search/movie?api_key=c8806e55322afd9062df9442a5feffec&query=' + searchText, function(response) {
    console.log(response.results);
  });
}

function getMovies(url, callback) {
  var templateXHR = new XMLHttpRequest();

  templateXHR.responseType = 'document';

  templateXHR.addEventListener('loadend', function() {
    callback.call(this, JSON.parse(templateXHR.responseText));
  }, false);

  templateXHR.open('GET', url, true);
  templateXHR.send();

  return templateXHR;
}
