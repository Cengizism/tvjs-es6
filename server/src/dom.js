class Dom {
  constructor() {}

  domParser(body) {
    let parser = new DOMParser();
    return parser.parseFromString(body, 'application/xml');
  }

  domReplacer(data, target, doc) {
    let domImplementation = doc.implementation;
    let lsParser = domImplementation.createLSParser(1, null);
    let lsInput = domImplementation.createLSInput();

    lsInput.stringData = data;

    lsParser.parseWithContext(lsInput, doc.getElementsByTagName(target).item(0), 2);
  }
}

export default Dom;
