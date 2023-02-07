import Web3 from "web3";

const Web3Util = (): Web3 => {
  // Configuring the connection to an Ethereum node
  // const network = process.env.REACT_APP_ETHEREUM_NETWORK;

  // const infura = `https://${network}.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`;
  // const web3 = new Web3(
  // new Web3.providers.WebsocketProvider("ws://127.0.0.1:7546")
  // );
  // const web3: Web3 = new Web3(new Web3.providers.HttpProvider(local));

  const provider = `ws://${process.env.REACT_APP_ETH_HOST}:${process.env.REACT_APP_ETH_PORT}`;
  const web3: Web3 = new Web3(Web3.givenProvider || provider);

  // Creating a signing account from a private key
  // var privateKey = process.env.REACT_APP_SIGNER_PRIVATE_KEY;
  // const signer = web3.eth.accounts.privateKeyToAccount(`${privateKey}`, true);
  // web3.eth.accounts.wallet.add(signer);

  return web3;
};

export default Web3Util;
