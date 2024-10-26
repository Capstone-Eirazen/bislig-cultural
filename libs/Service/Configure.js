const path = require('path');
const fs = require('fs');

class Configure {
   constructor() {
      this.basePath = path.join(__dirname, '..', '..', 'config');
   }

   read(pathString) {
      let keys = pathString.split('.');
      let basePath = this.basePath;
      let currentPath;

      do {
         currentPath = path.join(basePath, keys.shift());
      } while (fs.existsSync(currentPath) && fs.lstatSync(currentPath).isDirectory());

      if (!fs.existsSync(currentPath + '.js')) {
         return undefined;
      }

      let configData;
      try {
         configData = require(currentPath);
      } catch (error) {
         return undefined;
      }

      while (keys.length > 0) {
         let key = keys.shift();
         if (configData[key] === undefined) {
            return undefined;
         }
         configData = configData[key];
      }

      return configData;
   }
}

module.exports = new Configure();