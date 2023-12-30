const { createHash } = require('crypto');


async function hash(prefix, userId, fileName,) {
   try {
      const inputData = prefix + userId + fileName;
      const hash = createHash('md5').update(inputData).digest('hex');
      return hash;
   } catch (error) {
      console.log('failed to create hash..');
      throw error;
   }
}

module.exports = hash;