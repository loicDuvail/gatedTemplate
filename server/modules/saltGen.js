function saltGen(length) {
   let salt = "";
   let chars =
      "qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890-_*&^%$#@!";
   for (let i = 0; i < length; i++) {
      salt += chars[Math.floor(Math.random() * chars.length)];
   }
   return salt;
}

module.exports = saltGen;
