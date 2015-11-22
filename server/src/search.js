import DomHelper from './dom-helper';

let movies = {
  'The Puffin': 1,
  'Lola and Max': 2,
  'Road to Firenze': 3,
  'Three Developers and a Baby': 4,
  'Santa Cruz Surf': 5,
  'Cinque Terre': 6,
  'Creatures of the Rainforest': 7
};

class Search {
    constructor(TVBaseURL) {
      this.TVBaseURL = TVBaseURL;

      this.domHelper = new DomHelper();
    }

    buildResults(doc, searchText) {
      let regExp = new RegExp(searchText, 'i');
      let matchesText = value => regExp.test(value);

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
              <img src="${this.TVBaseURL}resources/images/movies/movie_${movies[title]}.lcr" width="350" height="520" />
              <title>${title}</title>
            </lockup>`;
        }

        stringData += `</section></shelf>`;
      }

      this.domHelper.replace(stringData, 'collectionList', doc);
    }
}

export default Search;
