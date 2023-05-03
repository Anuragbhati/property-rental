const Web3 = require("web3");

// Loading the contract ABI
// (the results of a previous compilation step)
const fs = require("fs");

async function main(name) {
  const { abi } = JSON.parse(fs.readFileSync("bhati.json"));
  // const {name,price}=val
  // const name = document.getElementById("propertyName").value;
  // const price = web3.utils.toWei(
  //   document.getElementById("pricePerNight").value,
  //   "ether"
  // );
  // Configuring the connection to an Ethereum node
  const network = process.env.ETHEREUM_NETWORK;
  const web3 = new Web3(
    new Web3.providers.HttpProvider(
      `https://${network}.infura.io/v3/${process.env.INFURA_API_KEY}`
    )
  );
  // Creating a signing account from a private key
  const signer = web3.eth.accounts.privateKeyToAccount(
    process.env.SIGNER_PRIVATE_KEY
  );
  web3.eth.accounts.wallet.add(signer);
  // Creating a Contract instance
  const contract = new web3.eth.Contract(
    abi,
    // Replace this with the address of your deployed contract
    process.env.DEMO_CONTRACT
  );
  // Issuing a transaction that calls the `echo` method
  const tx = await contract.methods.createProperty(
    name.name,
    name.pricePerNight
  );
  const receipt = await tx
    .send({
      from: signer.address,
      gas: await tx.estimateGas(),
    })
    .once("receipt", function (receipt) {
      // console.log(
      //   "Property created successfully with ID: " +
      //     receipt.events.PropertyCreated.returnValues.id
      // );
      // console.log(receipt.events.PropertyCreated.returnValues, "bhati");
    })
    .on("error", function (error) {
      console.error(error);
      console.log("Failed to create property. See console for details.");
    });
  return { data: receipt.events.PropertyCreated.returnValues };

  // const tx2 = contract.events.PropertyCreated({
  //   id: 5,
  //   name: "mukul",
  //   pricePerNight: 2,
  //   owner: "testingaddress",
  // });
  // const receipt3 = await tx2;
  // console.log(receipt2, "reciept2");
  // const tx3 = contract.events.RentalAgreementCreated(
  //   5,
  //   "dushyant",
  //   "testingAdress",
  //   "mukul",
  //   "bhatiHouse",
  //   "25/04/2022",
  //   "28/04/2022"

  // );
  // const receipt3 = await tx3;
  // console.log(receipt3, "reciept3");
  //   from: signer.address,
  //   gas: await tx.estimateGas(),
  // })
  // .once("receipt", function (receipt2) {
  //   console.log(
  //     "Property created successfully with ID: " +
  //       receipt2.events.PropertyCreated.returnValues.id
  //   );
  // })
  // .on("error", function (error) {
  //   console.error(error);
  //   console.log("Failed to create property. See console for details.");
  // });
  //   .once("transactionHash", (txhash) => {
  //     console.log(`Mining transaction ...`);
  //     console.log(`https://${network}.etherscan.io/tx/${txhash}`);
  //   });
  // // The transaction is now on chain!
  // console.log(`Mined in block ${receipt.blockNumber}`);
}

require("dotenv").config();
module.exports = { main };
