// "SPDX-License-Identifier": "UNLICENSED"
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

    mapping(uint256 => Property) public properties;
    mapping(uint256 => RentalAgreement) public rentalAgreements;
    uint256 public propertyCounter;
    uint256 public rentalAgreementCounter;

    event PropertyCreated(
        uint256 indexed id,
        string name,
        uint256 pricePerNight,
        address owner
    );
    event RentalAgreementCreated(
        uint256 indexed id,
        address renter,
        address propertyOwner,
        string propertyName,
        uint256 checkInDate,
        uint256 checkOutDate,
        uint256 totalPrice
    );

    constructor() public {
        propertyCounter = 0;
        rentalAgreementCounter = 0;
    }

    function createProperty(
        string memory _name,
        uint256 _pricePerNight
    ) public {
        propertyCounter++;
        properties[propertyCounter] = Property(
            _name,
            _pricePerNight,
            msg.sender,
            true
        );
        emit PropertyCreated(
            propertyCounter,
            _name,
            _pricePerNight,
            msg.sender
        );
    }

    function rentProperty(
        uint256 _propertyId,
        uint256 _checkInDate,
        uint256 _checkOutDate
    ) public {
        Property storage property = properties[_propertyId];
        // require(
        //     property.isAvailable == true,
        //     "Property is not available for rent."
        // );
        // require(
        //     msg.sender != property.owner,
        //     "You cannot rent your own property."
        // );

        rentalAgreementCounter++;
        rentalAgreements[rentalAgreementCounter] = RentalAgreement(
            msg.sender,
            property.owner,
            property.name,
            _checkInDate,
            _checkOutDate,
            calculateTotalPrice(_checkInDate, _checkOutDate, property.pricePerNight),
            true,
            false
        );
        property.isAvailable = false;

        emit RentalAgreementCreated(
            rentalAgreementCounter,
            msg.sender,
            property.owner,
            property.name,
            _checkInDate,
            _checkOutDate,
            calculateTotalPrice(_checkInDate, _checkOutDate, property.pricePerNight)
        );
    }

    function cancelRental(uint256 _rentalAgreementId) public {
        RentalAgreement storage rentalAgreement = rentalAgreements[
            _rentalAgreementId
        ];
        require(
            rentalAgreement.isActive == true,
            "Rental agreement is not active."
        );
        require(
            msg.sender == rentalAgreement.renter,
            "Only the renter can cancel the rental agreement."
        );

        Property storage property = properties[propertyCounter];
        property.isAvailable = true;
        rentalAgreement.isActive = false;
        rentalAgreement.isComplete = true;
    }

    function completeRental(uint256 _rentalAgreementId) public {
        RentalAgreement storage rentalAgreement = rentalAgreements[
            _rentalAgreementId
        ];
        require(
            rentalAgreement.isActive == true,
            "Rental agreement is not active."
        );
        require(
            msg.sender == rentalAgreement.propertyOwner,
            "Only the property owner can complete the rental agreement."
        );

        Property storage property = properties[propertyCounter];
        property.isAvailable = true;
        rentalAgreement.isActive = false;
        rentalAgreement.isComplete = true;
    }

    function calculateTotalPrice(
        uint256 _checkInDate,
        uint256 _checkOutDate,
        uint256 _pricePerNight
    ) internal pure returns (uint256) {
        require(_checkOutDate > _checkInDate, "Invalid date range.");
        uint256 duration = _checkOutDate - _checkInDate;
        return _pricePerNight * duration;
    }
}
