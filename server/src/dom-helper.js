class DomHelper {
  constructor() {
    this.parser = new DOMParser();
  }

  parse(body) {
    return this.parser.parseFromString(body, 'application/xml');
  }

  replace(data, target, doc) {
    let domImplementation = doc.implementation;
    let lsParser = domImplementation.createLSParser(1, null);
    let lsInput = domImplementation.createLSInput();

    lsInput.stringData = data;

    lsParser.parseWithContext(lsInput, doc.getElementsByTagName(target).item(0), 2);
  }
}

export default DomHelper;
