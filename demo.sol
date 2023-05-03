pragma solidity >=0.5.8;
contract PropertyRental {
    struct Property {
        string name;
        uint256 pricePerNight;
        address owner;
        bool isAvailable;
    }
    
    struct RentalAgreement {
        address renter;
        address propertyOwner;
        string propertyName;
        uint256 checkInDate;
        uint256 checkOutDate;
        uint256 totalPrice;
        bool isActive;
        bool isComplete;
    }
    
    mapping (uint256 => Property) public properties;
    mapping (uint256 => RentalAgreement) public rentalAgreements;
    uint256 public propertyCounter;
    uint256 public rentalAgreementCounter;
    
    event PropertyCreated(uint256 indexed id, string name, uint256 pricePerNight, address owner);
    event RentalAgreementCreated(uint256 indexed id, address renter, address propertyOwner, string propertyName, uint256 checkInDate, uint256 checkOutDate, uint256 totalPrice);
    
    function createProperty(string memory _name, uint256 _pricePerNight) public {
        propertyCounter++;
        properties[propertyCounter] = Property(_name, _pricePerNight, msg.sender, true);
        emit PropertyCreated(propertyCounter, _name, _pricePerNight, msg.sender);
    }
    
    function rentProperty(uint256 _propertyId, uint256 _checkInDate, uint256 _checkOutDate) public payable {
        Property storage property = properties[_propertyId];
        require(property.isAvailable == true, "Property is not available for rent.");
        require(msg.value == property.pricePerNight * (_checkOutDate - _checkInDate), "Invalid payment amount.");
        
        rentalAgreementCounter++;
        rentalAgreements[rentalAgreementCounter] = RentalAgreement(msg.sender, property.owner, property.name, _checkInDate, _checkOutDate, msg.value, true, false);
        property.isAvailable = false;
        
        emit RentalAgreementCreated(rentalAgreementCounter, msg.sender, property.owner, property.name, _checkInDate, _checkOutDate, msg.value);
    }
    
    function cancelRental(uint256 _rentalAgreementId) public {
        RentalAgreement storage rentalAgreement = rentalAgreements[_rentalAgreementId];
        require(rentalAgreement.isActive == true, "Rental agreement is not active.");
        require(msg.sender == rentalAgreement.renter, "Only the renter can cancel the rental agreement.");
        
        Property storage property = properties[propertyCounter];
        property.isAvailable = true;
        rentalAgreement.isActive = false;
        rentalAgreement.isComplete = true;
        
        payable(msg.sender).transfer(rentalAgreement.totalPrice);
    }
    
    function completeRental(uint256 _rentalAgreementId) public {
        RentalAgreement storage rentalAgreement = rentalAgreements[_rentalAgreementId];
        require(rentalAgreement.isActive == true, "Rental agreement is not active.");
        require(msg.sender == rentalAgreement.propertyOwner, "Only the property owner can complete the rental agreement.");
        
        Property storage property = properties[propertyCounter];
        property.isAvailable = true;
        rentalAgreement.isActive = false;
        rentalAgreement.isComplete = true;
        
        payable(rentalAgreement.propertyOwner).transfer(rentalAgreement.totalPrice);
    }
}
