const BookFactory = artifacts.require("BookFactory");

module.exports = function (deployer) {
  deployer.deploy(BookFactory);
};
