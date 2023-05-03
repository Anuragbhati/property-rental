const Web3 = require("web3");
const fs = require("fs");
const name = {
  name: "bhati House",
  pricePerNight: 2,
};
async function rentProperty() {
  const { abi } = JSON.parse(fs.readFileSync("bhati.json"));
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  const contract = new web3.eth.Contract(abi, process.env.DEMO_CONTRACT);

  const tx = await contract.events.PropertyCreated(
    "bhati",
    2,
    "0x4D5213c1C0BcFE1272ACc12f291062B2E672Da3F"
  );

  console.log(tx.id);
}

require("dotenv").config();
rentProperty();
module.exports = { rentProperty };
