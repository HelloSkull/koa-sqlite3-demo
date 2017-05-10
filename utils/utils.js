const crypto = require('crypto');

const utils ={
    md5:(encryptString)=>{
        const hasher = crypto.createHash("md5");
        hasher.update(encryptString);
        encryptString= hasher.digest('hex');
        return encryptString;
    }
};

module.exports = utils;