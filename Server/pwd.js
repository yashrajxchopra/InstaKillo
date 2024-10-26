const bcrypt = require("bcrypt");

const crypt = async () => {
    const hashedPassword = await bcrypt.hash('123456', 10);
    return hashedPassword;
};

(async () => {
    const pwd = await crypt();
    console.log(pwd);  // Now this will log the hashed password
})();
