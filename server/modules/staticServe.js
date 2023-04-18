const fs = require("fs");
const path = require("path");

function getEveryFile(directoryAddr) {
   let files = [];

   function recursiveFetch(directory) {
      fs.readdirSync(directory).forEach((file) => {
         const filePath = path.join(directory, file);
         if (fs.lstatSync(filePath).isDirectory())
            return recursiveFetch(filePath);
         files.push({
            relPath: filePath.substring(directoryAddr.length),
            absPath: filePath,
         });
      });
   }

   recursiveFetch(directoryAddr);

   return files;
}

// for every file in parentDir, create route like '/<parentDirName>/<..relPath from parentDir to file>'
function serve(dirAddr, rootPath = "", parentRouterRoute = "") {
   let files = getEveryFile(dirAddr);
   console.log(
      `\n---- automatic routes creation on '${parentRouterRoute}' ----\n`
   );
   files.forEach((file) => {
      file.relPath = rootPath + file.relPath.replaceAll("\\", "/");
      console.log(`route: ${parentRouterRoute}${file.relPath}
filePath: ${file.absPath}
- - - - - - - - - - - - - - -\n`);
   });
   return (req, res, next) => {
      const fileToServe = files.find((file) => file.relPath == req.path);
      if (!fileToServe) return next();
      return res.sendFile(fileToServe.absPath);
   };
}

module.exports = serve;
