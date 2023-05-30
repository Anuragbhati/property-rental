const Web3 = require("web3");
const fs = require("fs");

const name = "bhatiji props";
const pricePerNight = 2;
const propertyId = 1;
const checkInDate = "2023-05-30";
const checkOutDate = "2023-05-31";

const checkInUnixTime = new Date(checkInDate).getTime() / 1000;
const checkOutUnixTime = new Date(checkOutDate).getTime() / 1000;

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
  web3.eth.getBalance(signer.address)
  .then((balance) => {
    console.log('Balance:', web3.utils.fromWei(balance, 'ether'), 'ETH');
  })
  .catch((error) => {
    console.error('Error:', error);
  });
  // async function createProperty(name, pricePerNight) {
  //   try {
  //     const accounts = await web3.eth.getAccounts();
  //     const result = await contract.methods.createProperty(name, pricePerNight);
  //     const data = await result.send({ from: signer.address,gas: await result.estimateGas() });
  //     console.log("Property created:", data);
  //   } catch (error) {
  //     console.error("Error creating property:", error);
  //   }
  // }
  // createProperty(name, pricePerNight);
  // Example usage: Renting a property
  async function rentProperty(propertyId, checkInDate, checkOutDate) {
    try {
      const accounts = await web3.eth.getAccounts();
      const gasPrice = await web3.eth.getGasPrice();
      console.log(gasPrice,'gasprice');
      const result = await contract.methods.rentProperty(
        propertyId,
        checkInDate,
        checkOutDate
      );
      const data = await result.send({ from: signer.address,gasPrice,gas: await result.estimateGas()+1000000 });
      console.log("Property rented:", data);
    } catch (error) {
      console.error("Error renting property:", error.message);
    }
  }
  rentProperty(propertyId, checkInUnixTime, checkOutUnixTime);
  // const tx1 = contract.methods.createProperty(name.name, name.pricePerNight);

  // const receipt1 = await tx1
  //   .send({
  //     from: signer.address,
  //     gas: await tx1.estimateGas(),
  //   })
  //   .once("receipt", function (receipt) {
  //     console.log(
  //       "Property created successfully with ID: " +
  //         receipt.events.PropertyCreated.returnValues.id
  //     );
  //   })
  //   .on("error", function (error) {
  //     console.error(error);
  //     console.log("Failed to create property. See console for details.");
  //   });

  // const checkInDate = "2023-05-01";
  // const checkOutDate = "2023-05-03";
  // const pricePerNight = name.pricePerNight;

  // const checkInUnixTime = new Date(checkInDate).getTime() / 1000;
  // const checkOutUnixTime = new Date(checkOutDate).getTime() / 1000;

  // const numNights = Math.ceil((checkOutUnixTime - checkInUnixTime) / 86400);
  // const rentalCostInEther = pricePerNight * numNights;
  // const rentalCostInWei = web3.utils.toWei(
  //   rentalCostInEther.toString(),
  //   "ether"
  // );

  // const tx2 = contract.methods.rentProperty(
  //   receipt1.events.PropertyCreated.returnValues.id,
  //   checkInUnixTime,
  //   checkOutUnixTime
  // );

  // const receipt2 = await tx2
  //   .send({
  //     from: signer.address,
  //     gas: await tx2.estimateGas()+100000,
  //   })
  //   .once("receipt", function (receipt) {
  //     console.log(
  //       "Rental agreement created successfully with ID: " +
  //         receipt.events.RentalAgreementCreated.returnValues.id
  //     );
  //   })
  //   .on("error", function (error) {
  //     console.error(error);
  //     console.log(
  //       "Failed to create rental agreement. See console for details."
  //     );
  //   });
}

require("dotenv").config();
rentProperty();
module.exports = { rentProperty };
