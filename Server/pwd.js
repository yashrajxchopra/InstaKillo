const bcrypt = require("bcryptjs");

const crypt = async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    return hashedPassword;
};

(async () => {
    const pwd = await crypt();
    console.log(pwd);  
    
})();

