let partials = {};

partials.loadingTemplate = `<?xml version="1.0" encoding="UTF-8" ?>
                              <document>
                                <loadingTemplate>
                                  <activityIndicator>
                                    <text>Loading...</text>
                                  </activityIndicator>
                                </loadingTemplate>
                              </document>`;

partials.alertBody = `<?xml version="1.0" encoding="UTF-8" ?>
                        <document>
                          <alertTemplate>
                            <title>{{title}}</title>
                            <description>{{description}}</description>
                          </alertTemplate>
                        </document>`;

export default partials;
