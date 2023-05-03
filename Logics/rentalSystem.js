var web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
// const Web3Eth = require('web3-eth');
// const axios = require("axios");
// const eth = new Web3Eth('ws://localhost:8546');

const contractABI = [
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "pricePerNight",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "owner",
        type: "address",
      },
    ],
    name: "PropertyCreated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "id",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "address",
        name: "renter",
        type: "address",
      },
      {
        indexed: false,
        internalType: "address",
        name: "propertyOwner",
        type: "address",
      },
      {
        indexed: false,
        internalType: "string",
        name: "propertyName",
        type: "string",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "checkInDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "checkOutDate",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "totalPrice",
        type: "uint256",
      },
    ],
    name: "RentalAgreementCreated",
    type: "event",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalAgreementId",
        type: "uint256",
      },
    ],
    name: "cancelRental",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_rentalAgreementId",
        type: "uint256",
      },
    ],
    name: "completeRental",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "string",
        name: "_name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "_pricePerNight",
        type: "uint256",
      },
    ],
    name: "createProperty",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "properties",
    outputs: [
      {
        internalType: "string",
        name: "name",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "pricePerNight",
        type: "uint256",
      },
      {
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        internalType: "bool",
        name: "isAvailable",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "propertyCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_propertyId",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_checkInDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "_checkOutDate",
        type: "uint256",
      },
    ],
    name: "rentProperty",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "rentalAgreementCounter",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    name: "rentalAgreements",
    outputs: [
      {
        internalType: "address",
        name: "renter",
        type: "address",
      },
      {
        internalType: "address",
        name: "propertyOwner",
        type: "address",
      },
      {
        internalType: "string",
        name: "propertyName",
        type: "string",
      },
      {
        internalType: "uint256",
        name: "checkInDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "checkOutDate",
        type: "uint256",
      },
      {
        internalType: "uint256",
        name: "totalPrice",
        type: "uint256",
      },
      {
        internalType: "bool",
        name: "isActive",
        type: "bool",
      },
      {
        internalType: "bool",
        name: "isComplete",
        type: "bool",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
];
const Address = "0x099264b414132e9Aa0F3bE1dA90E7B5B5Def7Fb9";

const contractAddress = Address;
const abi = contractABI;

let rentalContract;
window.addEventListener("load", () => {
  if (localStorage.getItem("createdProperty")) {
    const propertiesData = JSON.parse(localStorage.getItem("createdProperty"));
    console.log(propertiesData);
    propertiesData.map((item, index) => {
      console.log(item);
      var tbody = document.getElementById("propertiesTable");
      // create a new row element
      var row = document.createElement("tr");

      // create the cells for the row and set their values
      var idCell = document.createElement("td");
      idCell.textContent = item.id;
      var nameCell = document.createElement("td");
      nameCell.textContent = item.name;
      var priceCell = document.createElement("td");
      priceCell.textContent = item.pricePerNight + "eth";
      var ownerCell = document.createElement("td");
      ownerCell.textContent = item.owner;
      var availabilityCell = document.createElement("td");
      availabilityCell.textContent = "Available";

      // add the cells to the row
      row.appendChild(idCell);
      row.appendChild(nameCell);
      row.appendChild(priceCell);
      row.appendChild(ownerCell);
      row.appendChild(availabilityCell);

      // add the row to the table body
      tbody.appendChild(row);
    });
  }
});
// async function getWeb3() {
//   if (window.ethereum) {
//     test = new Web3(window.ethereum);
//     await window.ethereum.enable();
//     rentalContract = new test.eth.Contract(abi, contractAddress);
//   } else if (window.web3) {
//     window.web3 = new Web3(window.web3.currentProvider);
//   } else {
//     console.log(
//       "Non-Ethereum browser detected. You should consider trying MetaMask!"
//     );
//   }
// }
// window.addEventListener("load", getWeb3());
// const web3 = new Web3(window.ethereum);

// replace with your contract address
// Instantiate the web3 provider
if (window.ethereum) {
  window.web3 = new Web3(window.ethereum);
  window.ethereum.enable();
} else {
  console.log("No web3 provider detected");
}

// Contract information

// Instantiate the contract

// DOM Elements
const propertyList = document.getElementById("propertyList");
const rentalAgreementList = document.getElementById("rentalAgreementList");
const createPropertyForm = document.getElementById("createPropertyForm");
const rentPropertyForm = document.getElementById("rentPropertyForm");
const cancelRentalForm = document.getElementById("cancelRentalForm");
const completeRentalForm = document.getElementById("completeRentalForm");

// Helper function to display the properties
function displayProperties(properties) {
  propertyList.innerHTML = "";
  properties.forEach((property) => {
    const listItem = document.createElement("li");
    const name = document.createElement("h3");
    const price = document.createElement("p");
    const owner = document.createElement("p");
    const rentButton = document.createElement("button");

    name.innerHTML = property.name;
    price.innerHTML = `Price per night: ${property.pricePerNight} ETH`;
    owner.innerHTML = `Owner: ${property.owner}`;
    rentButton.innerHTML = "Rent";
    rentButton.addEventListener("click", () => {
      rentPropertyForm.style.display = "block";
      document.getElementById("rentPropertyId").value = property.id;
    });

    listItem.appendChild(name);
    listItem.appendChild(price);
    listItem.appendChild(owner);
    listItem.appendChild(rentButton);
    propertyList.appendChild(listItem);
  });
}

// Helper function to display the rental agreements
function displayRentalAgreements(rentalAgreements) {
  rentalAgreementList.innerHTML = "";
  rentalAgreements.forEach((rentalAgreement) => {
    const listItem = document.createElement("li");
    const renter = document.createElement("p");
    const propertyName = document.createElement("h3");
    const checkInDate = document.createElement("p");
    const checkOutDate = document.createElement("p");
    const totalPrice = document.createElement("p");
    const cancelButton = document.createElement("button");
    const completeButton = document.createElement("button");

    renter.innerHTML = `Renter: ${rentalAgreement.renter}`;
    propertyName.innerHTML = rentalAgreement.propertyName;
    checkInDate.innerHTML = `Check-in Date: ${new Date(
      rentalAgreement.checkInDate * 1000
    ).toLocaleDateString()}`;
    checkOutDate.innerHTML = `Check-out Date: ${new Date(
      rentalAgreement.checkOutDate * 1000
    ).toLocaleDateString()}`;
    totalPrice.innerHTML = `Total Price: ${rentalAgreement.totalPrice} ETH`;
    cancelButton.innerHTML = "Cancel Rental";
    cancelButton.addEventListener("click", () => {
      cancelRentalForm.style.display = "block";
      document.getElementById("cancelRentalId").value = rentalAgreement.id;
    });
    completeButton.innerHTML = "Complete Rental";
    completeButton.addEventListener("click", () => {
      completeRentalForm.style.display = "block";
      document.getElementById("completeRentalId").value = rentalAgreement.id;
    });

    listItem.appendChild(renter);
    listItem.appendChild(propertyName);
    listItem.appendChild(checkInDate);
    listItem.appendChild(checkOutDate);
    listItem.appendChild(totalPrice);
    listItem.appendChild(cancelButton);
    listItem.appendChild(completeButton);
    rentalAgreementList.appendChild(listItem);
  });
}

// Get contract instance
async function getContract() {
  // const web3 = await getWeb3();
  const networkId = await test.eth.net.getId();
  // const deployedNetwork = PropertyRental.networks[networkId];
  return rentalContract;
  // new web3.eth.Contract(
  //   abi
  //   // deployedNetwork && deployedNetwork.address
  // );
}

// Create property
// async function createProperty(e) {
//   e.preventDefault();
//   const contract = await getContract();

//   await contract.methods
//     .createProperty(name, pricePerNight)
//     .send({ from: accounts[0] });
//   alert("Property created successfully!");
//   window.location.reload();
// }
let loader = false;
async function createProperty(e) {
  const propertyName = document.getElementById("propertyName").value;
  const pricePerNight = document.getElementById("pricePerNight").value;
  console.log(propertyName, pricePerNight);

  e.preventDefault();

  if (propertyName && pricePerNight) {
    let spinner = document.getElementById("spinner");
    let button = document.getElementById("createPropertyButton");
    loader = true;
    if (loader) {
      spinner.style.display = "block";
      button.style.display = "none";
    }
    await fetch(
      `http://localhost:3000/api/main?name=${propertyName}&pricePerNight=${pricePerNight}`
    ).then(async (res) => {
      const data = await res.json();
      spinner.style.display = "none";
      button.style.display = "block";
      console.log("data from frontend", data);
      const storageContainer = JSON.parse(
        localStorage.getItem("createdProperty")
      );
      if (storageContainer) {
        storageContainer.push(data.data);
        localStorage.setItem(
          "createdProperty",
          JSON.stringify(storageContainer)
        );
        window.location.reload();
      } else {
        localStorage.setItem("createdProperty", JSON.stringify([data.data]));
        window.location.reload();
      }
      // get a reference to the table body element
    });
  } else {
    alert("Please fill out all fields");
  }

  // check if web3.eth is defined
  // if (typeof web3.eth !== "undefined") {
  //   const name = document.getElementById("propertyName").value;
  //   const price = web3.utils.toWei(
  //     document.getElementById("pricePerNight").value,
  //     "ether"
  //   );

  //   const contract = await getContract();

  //   contract.methods
  //     .createProperty(name, price)
  //     .send({ from: "0x4D5213c1C0BcFE1272ACc12f291062B2E672Da3F" })
  //     .on("receipt", function (receipt) {
  //       alert(
  //         "Property created successfully with ID: " +
  //           receipt.events.PropertyCreated.returnValues.id
  //       );
  //     })
  //     .on("error", function (error, receipt) {
  //       console.error(error);
  //       alert("Failed to create property. See console for details.");
  //     });
  // } else {
  //   alert("Please connect to MetaMask or another web3 provider.");
  // }
}

// Rent property
async function rentProperty(event, propertyId) {
  event.preventDefault();
  const checkInDate = document.getElementById(
    "checkin-date-" + propertyId
  ).value;
  const checkOutDate = document.getElementById(
    "checkout-date-" + propertyId
  ).value;
  const totalPrice = pricePerNight * (checkOutDate - checkInDate);
  if (propertyId && pricePerNight) {
    let spinner = document.getElementById("spinner");
    let button = document.getElementById("createPropertyButton");
    // loader = true;
    // if (loader) {
    //   spinner.style.display = "block";
    //   button.style.display = "none";
    // }
    await fetch(
      `http://localhost:3000/api/rent?name=${propertyName}&pricePerNight=${pricePerNight}`
    ).then(async (res) => {
      const data = await res.json();
      // spinner.style.display = "none";
      // button.style.display = "block";
      console.log("data from frontend", data);
      const storageContainer = JSON.parse(
        localStorage.getItem("rentedProperty")
      );
      if (storageContainer) {
        storageContainer.push(data.data);
        localStorage.setItem(
          "rentedProperty",
          JSON.stringify(storageContainer)
        );
        window.location.reload();
      } else {
        localStorage.setItem("rentedProperty", JSON.stringify([data.data]));
        window.location.reload();
      }
      // get a reference to the table body element
    });
  } else {
    alert("Please fill out all fields");
  }

  alert("Property rented successfully!");
  window.location.reload();
}

// Cancel rental agreement
async function cancelRentalAgreement(rentalAgreementId) {
  const contract = await getContract();
  await contract.methods
    .cancelRental(rentalAgreementId)
    .send({ from: accounts[0] });
  alert("Rental agreement cancelled successfully!");
  window.location.reload();
}

// Complete rental agreement
async function completeRentalAgreement(rentalAgreementId) {
  const contract = await getContract();
  await contract.methods
    .completeRental(rentalAgreementId)
    .send({ from: accounts[0] });
  alert("Rental agreement completed successfully!");
  window.location.reload();
}

// Load properties
async function loadProperties() {
  const contract = await getContract();
  const propertyCounter = await contract.methods.propertyCounter().call();
  const propertiesTable = document.getElementById("properties-table");
  for (let i = 1; i <= propertyCounter; i++) {
    const property = await contract.methods.properties(i).call();
    const propertyRow = document.createElement("tr");
    propertyRow.innerHTML = `
      <td>${property.name}</td>
      <td>${property.pricePerNight} ether</td>
      <td>${property.owner}</td>
      <td>
        ${
          property.isAvailable
            ? '<button onclick="rentProperty(' + i + ')">Rent</button>'
            : "<span>Not available</span>"
        }
      </td>
    `;
    propertiesTable.appendChild(propertyRow);
  }
}
