const bcrypt = require("bcrypt");

const crypt = async () => {
    const hashedPassword = await bcrypt.hash('', 10);
    return hashedPassword;
};

(async () => {
    const pwd = await crypt();
    console.log(pwd);  
    
})();

