const Web3 = require("web3");
const fs = require("fs");

const name = {
  name: "bhatiji props",
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
  console.log(await web3.eth.getBalance(signer.address));
  const contract = new web3.eth.Contract(abi, process.env.DEMO_CONTRACT);

  const tx1 = contract.methods.createProperty(name.name, 2);

  const receipt1 = await tx1
    .send({
      from: signer.address,
      gas: await tx1.estimateGas(),
    })
    .once("receipt", function (receipt) {
      console.log(
        "Property created successfully with ID: " +
          receipt.events.PropertyCreated.returnValues.id
      );
    })
    .on("error", function (error) {
      console.error(error);
      console.log("Failed to create property. See console for details.");
    });

  const checkInDate = "2023-05-01";
  const checkOutDate = "2023-05-03";
  const pricePerNight = name.pricePerNight;

  const checkInUnixTime = new Date(checkInDate).getTime() / 1000;
  const checkOutUnixTime = new Date(checkOutDate).getTime() / 1000;

  const numNights = Math.ceil((checkOutUnixTime - checkInUnixTime) / 86400);
  const rentalCostInEther = pricePerNight * numNights;
  const rentalCostInWei = web3.utils.toWei(
    rentalCostInEther.toString(),
    "ether"
  );

  const tx2 = contract.methods.rentProperty(
    receipt1.events.PropertyCreated.returnValues.id,
    checkInUnixTime,
    checkOutUnixTime
  );

  const receipt2 = await tx2
    .send({
      from: signer.address,
      gas: await tx2.estimateGas(),
      value: rentalCostInWei,
    })
    .once("receipt", function (receipt) {
      console.log(
        "Rental agreement created successfully with ID: " +
          receipt.events.RentalAgreementCreated.returnValues.id
      );
    })
    .on("error", function (error) {
      console.error(error);
      console.log(
        "Failed to create rental agreement. See console for details."
      );
    });
}

require("dotenv").config();
rentProperty();
module.exports = { rentProperty };
