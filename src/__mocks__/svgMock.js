// src/__mocks__/svgMock.js
module.exports = {
    process(filename) {
      return `module.exports =  ${JSON.stringify(path.basename(filename))};`;
    }
  };
