const PublicationFactory = artifacts.require("PublicationFactory");

module.exports = function (deployer) {
  deployer.deploy(PublicationFactory);
};
