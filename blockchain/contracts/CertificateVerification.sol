// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title CertificateVerification
 * @dev Smart contract for storing and verifying certificate hashes on blockchain
 * Used by VeritasAI for ensuring certificate authenticity and immutability
 */
contract CertificateVerification {
    
    // Structure to store certificate information
    struct Certificate {
        string certificateId;
        string certificateHash;
        string institutionName;
        string issuerEmail;
        uint256 timestamp;
        bool isValid;
        address issuer;
    }
    
    // Mapping from certificate hash to certificate details
    mapping(string => Certificate) public certificates;
    
    // Mapping to track all certificate hashes
    mapping(string => bool) public certificateExists;
    
    // Array to store all certificate hashes for iteration
    string[] public certificateHashes;
    
    // Mapping to track authorized institutions
    mapping(address => bool) public authorizedInstitutions;
    
    // Contract owner
    address public owner;
    
    // Events
    event CertificateStored(
        string indexed certificateId,
        string certificateHash,
        string institutionName,
        address indexed issuer,
        uint256 timestamp
    );
    
    event CertificateVerified(
        string indexed certificateHash,
        bool isValid,
        uint256 timestamp
    );
    
    event InstitutionAuthorized(address indexed institution, string institutionName);
    event InstitutionRevoked(address indexed institution);
    
    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only contract owner can call this function");
        _;
    }
    
    modifier onlyAuthorized() {
        require(authorizedInstitutions[msg.sender] || msg.sender == owner, "Only authorized institutions can call this function");
        _;
    }
    
    // Constructor
    constructor() {
        owner = msg.sender;
        authorizedInstitutions[msg.sender] = true; // Owner is automatically authorized
    }
    
    /**
     * @dev Authorize an institution to issue certificates
     * @param institution Address of the institution
     * @param institutionName Name of the institution
     */
    function authorizeInstitution(address institution, string memory institutionName) 
        public 
        onlyOwner 
    {
        authorizedInstitutions[institution] = true;
        emit InstitutionAuthorized(institution, institutionName);
    }
    
    /**
     * @dev Revoke authorization from an institution
     * @param institution Address of the institution
     */
    function revokeInstitution(address institution) 
        public 
        onlyOwner 
    {
        authorizedInstitutions[institution] = false;
        emit InstitutionRevoked(institution);
    }
    
    /**
     * @dev Store a certificate hash on the blockchain
     * @param certificateId Unique identifier for the certificate
     * @param certificateHash SHA-256 hash of the certificate content
     * @param institutionName Name of the issuing institution
     * @param issuerEmail Email of the certificate issuer
     */
    function storeCertificate(
        string memory certificateId,
        string memory certificateHash,
        string memory institutionName,
        string memory issuerEmail
    ) 
        public 
        onlyAuthorized 
    {
        require(bytes(certificateId).length > 0, "Certificate ID cannot be empty");
        require(bytes(certificateHash).length > 0, "Certificate hash cannot be empty");
        require(!certificateExists[certificateHash], "Certificate already exists on blockchain");
        
        // Create new certificate record
        certificates[certificateHash] = Certificate({
            certificateId: certificateId,
            certificateHash: certificateHash,
            institutionName: institutionName,
            issuerEmail: issuerEmail,
            timestamp: block.timestamp,
            isValid: true,
            issuer: msg.sender
        });
        
        // Mark certificate as existing
        certificateExists[certificateHash] = true;
        
        // Add to certificates array
        certificateHashes.push(certificateHash);
        
        emit CertificateStored(
            certificateId,
            certificateHash,
            institutionName,
            msg.sender,
            block.timestamp
        );
    }
    
    /**
     * @dev Verify a certificate by its hash
     * @param certificateHash SHA-256 hash of the certificate to verify
     * @return isValid Whether the certificate is valid
     * @return certificateId ID of the certificate
     * @return institutionName Name of the issuing institution
     * @return issuerEmail Email of the certificate issuer
     * @return timestamp When the certificate was stored
     */
    function verifyCertificate(string memory certificateHash)
        public
        view
        returns (
            bool isValid,
            string memory certificateId,
            string memory institutionName,
            string memory issuerEmail,
            uint256 timestamp
        )
    {
        if (certificateExists[certificateHash]) {
            Certificate memory cert = certificates[certificateHash];
            return (
                cert.isValid,
                cert.certificateId,
                cert.institutionName,
                cert.issuerEmail,
                cert.timestamp
            );
        } else {
            return (false, "", "", "", 0);
        }
    }
    
    /**
     * @dev Invalidate a certificate (for cases of revocation)
     * @param certificateHash Hash of the certificate to invalidate
     */
    function invalidateCertificate(string memory certificateHash) 
        public 
        onlyAuthorized 
    {
        require(certificateExists[certificateHash], "Certificate does not exist");
        
        Certificate storage cert = certificates[certificateHash];
        require(cert.issuer == msg.sender || msg.sender == owner, "Only the issuer or owner can invalidate");
        
        cert.isValid = false;
        
        emit CertificateVerified(certificateHash, false, block.timestamp);
    }
    
    /**
     * @dev Get total number of certificates stored
     * @return Total count of certificates
     */
    function getTotalCertificates() public view returns (uint256) {
        return certificateHashes.length;
    }
    
    /**
     * @dev Get certificate hash by index
     * @param index Index in the certificates array
     * @return Certificate hash at the given index
     */
    function getCertificateHashByIndex(uint256 index) public view returns (string memory) {
        require(index < certificateHashes.length, "Index out of bounds");
        return certificateHashes[index];
    }
    
    /**
     * @dev Get certificate details by hash
     * @param certificateHash Hash of the certificate
     * @return Certificate struct
     */
    function getCertificateDetails(string memory certificateHash)
        public
        view
        returns (Certificate memory)
    {
        require(certificateExists[certificateHash], "Certificate does not exist");
        return certificates[certificateHash];
    }
    
    /**
     * @dev Check if an address is an authorized institution
     * @param institution Address to check
     * @return Whether the address is authorized
     */
    function isAuthorizedInstitution(address institution) public view returns (bool) {
        return authorizedInstitutions[institution];
    }
    
    /**
     * @dev Emergency function to pause certificate operations (if needed)
     * Only for extreme cases - not implemented in this version
     */
    function emergencyPause() public onlyOwner {
        // Implementation can be added if needed for security
        revert("Emergency pause functionality not implemented");
    }
}