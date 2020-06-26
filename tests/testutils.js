const fs = require('fs').promises;
const path = require("path");

const REG_URL = /(\b(http|ftp|https|ftps):\/\/[-A-ZáéíóúÁÉÍÓÚ0-9+&@#\/%?=~_|!:,.;]*[-A-ZáéíóúÁÉÍÓÚ0-9+&@#\/%=~_|])/ig;

const TestUtils = {};


TestUtils.checkFileExists = (filepath) => {
  return new Promise(async (resolve, reject) => {
    try {
      await fs.access(filepath, fs.F_OK);
      resolve(true);
    } catch (err) {
      resolve(false);
    }
  });
};

TestUtils.to = (promise) => {
    return promise
        .then(data => {
            return [null, data];
        })
        .catch(err => [err]);
};

TestUtils.getURL = (string) => {
    const urls = string.match(REG_URL);
    let url = null;
    if (urls instanceof Array) {
        url = urls[0];
    }
    return url;
};

TestUtils.exists = (thing) => {
    return thing!==undefined && thing!==null;
};

TestUtils.isString = (thing) => {
    return typeof thing === 'string' || thing instanceof String;
};

TestUtils.isObject = (thing) => {
    return typeof thing === 'object' || thing instanceof Object;
};

TestUtils.isNumber = (thing) => {
    let number = false;
    if (TestUtils.exists(thing)) {
        number = typeof parseInt(thing) === "number";
    }
    return number
};

TestUtils.isArray = (thing) => {
    return typeof thing === 'array' || thing instanceof Array;
};

TestUtils.isURL = (thing) => {
    if (TestUtils.isString(thing)) {
        return REG_URL.test(thing);
    }
};

TestUtils.isRegExp = (thing) => {
    return (thing instanceof RegExp);
};

TestUtils.isJSON = (thing) => {
    try {
        JSON.parse(thing);
        return true;
    } catch (e) {
        return false;
    }
};

TestUtils.search = (b, a) => {
    if (TestUtils.isRegExp(b)) {
        if (TestUtils.isString(a) && a.length > 0) {
            return b.test(a);
        } else {
            return false;
        }
    } else {
        if (TestUtils.isArray(a)) {
            let result = false;
            for (let item in a) {
                if (TestUtils.search(b, a[item])) {
                    result = true;
                }
            }
            return result;
        } else {
            if (TestUtils.isString(a.toString())) {
                return (a.toString().toLowerCase().indexOf(b.toLowerCase()) > -1);
            }
        }
    }
};

module.exports = TestUtils;
