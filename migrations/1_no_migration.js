var SolidityContract = artifacts.require("Twitter");

module.exports = function (deployer) {
    // Deploy the SolidityContract contract as our only task
    deployer.deploy(SolidityContract);
};
