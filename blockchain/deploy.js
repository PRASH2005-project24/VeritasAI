const Web3 = require('web3');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Contract ABI and Bytecode (will be generated after compilation)
const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "certificateHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "institutionName",
        "type": "string"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "issuer",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "CertificateStored",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "certificateHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "CertificateVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "institution",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "institutionName",
        "type": "string"
      }
    ],
    "name": "authorizeInstitution",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "certificateHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "institutionName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "issuerEmail",
        "type": "string"
      }
    ],
    "name": "storeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "certificateHash",
        "type": "string"
      }
    ],
    "name": "verifyCertificate",
    "outputs": [
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      },
      {
        "internalType": "string",
        "name": "certificateId",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "institutionName",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "issuerEmail",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalCertificates",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Mock bytecode for demo purposes (in real scenario, this would come from Solidity compilation)
const CONTRACT_BYTECODE = "0x608060405234801561001057600080fd5b50600080546001600160a01b031916331790556001600160a01b0316600090815260026020526040902060ff191660019081179091556105b8806100556000396000f3fe608060405234801561001057600080fd5b50600436106100575760003560e01c80634cb3663b1461005c5780635a7c0ee31461008c57806399244a4b146100af578063a8c3a5e5146100e2578063e7b3c7f71461010f575b600080fd5b6100746004803603810190610070919061036d565b61012c565b6040516100839493929190610451565b60405180910390f35b61009f600480360381019061009a91906103c8565b610203565b60405161008391906104d6565b6100c760048036038101906100c29190610318565b610240565b60405161008394939291906104f1565b6100ea6102e8565b6040516100f1919061056f565b60405180910390f35b6101176002805490565b604051610124919061058a565b60405180910390f35b600080600080600086604051610142919061043a565b90815260200160405180910390206000015414156101a2576001604051602001610160919061056f565b604051602081830303815290604052600060405160200161018190610425565b60405160208183030381529060405260006000945094509450945094506101fc565b60008660405161024491906105a1565b90815260200160405180910390206040518060a00160405290816000820154815260200160018201548152602001600282015481526020016003820154815260200160048201548152505090508060000151816020015182604001518360600151846080015194509450945094509450505b9392505050565b60008160405161024291906105a1565b908152602001604051809103902060001514159050919050565b610249336102f2565b610288576040517f08c394e000000000000000000000000000000000000000000000000000000000815260040161027f906105bb565b60405180910390fd5b6000825114156102cd576040517f08c394e00000000000000000000000000000000000000000000000000000000081526004016102c4906105db565b60405180910390fd5b6102d78251610329565b156102e3576102e581610346565b505b5050565b6000600180549050905090565b60008060025403610307919061058f565b9050919050565b6000604051602001610324919061036d565b60405160208183030381529060405290565b60006001604051602001610341919061036d565b60405160208183030381529060405290565b6000604051602001610362919061036d565b60405160208183030381529060405290565b600080fd5b600080fd5b6000604051905090565b600080fd5b600080fd5b600080fd5b600080fd5b600080fd5b6000819050919050565b6103b5816103a2565b81146103c057600080fd5b50565b6000813590506103d2816103ac565b92915050565b6000602082840312156103ee576103ed610395565b5b60006103fc848285016103c3565b91505092915050565b600082825260208201905092915050565b600061042182610405565b92915050565b600061043282610416565b905092915050565b600061044582610416565b905092915050565b600060a08201905061046260008301886103a2565b8181036020830152610474818761043a565b90508181036040830152610488818661043a565b9050818103606083015261049c818561043a565b90506104ab60808301846103a2565b9695505050505050565b60008115159050919050565b6104ca816104b5565b82525050565b60006020820190506104e560008301846104c1565b92915050565b600060a08201905061050060008301886104c1565b818103602083015261051281876105b8565b90508181036040830152610526818661043a565b9050818103606083015261053a818561043a565b905061054960808301846103a2565b9695505050505050565b610564816103a2565b82525050565b600060208201905061057f600083018461055b565b92915050565b6000602082019050610593600083018461055b565b92915050565b600061059f82846105b8565b915081905092915050565b600081519050919050565b6105be816105a8565b82525050565b600060208201905081810360008301526105de81846105b5565b905092915050565b7f43657274696669636174652068617368206e6f7420666f756e6400000000006000825260200191505600a26469706673582212200faba78c8e4f8ba9c0c9c5e8b0f8b3a5b8b6c5f8e0c0c0c0c0c0c0c0c0c0c0c064736f6c63430008070033";

class BlockchainService {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.networkUrl = process.env.BLOCKCHAIN_NETWORK || 'http://127.0.0.1:7545';
    this.contractAddress = process.env.CONTRACT_ADDRESS || null;
  }

  // Initialize Web3 connection
  async initialize() {
    try {
      // Connect to blockchain network (Ganache for development)
      this.web3 = new Web3(new Web3.providers.HttpProvider(this.networkUrl));
      
      // Get accounts
      const accounts = await this.web3.eth.getAccounts();
      if (accounts.length === 0) {
        throw new Error('No accounts found. Please ensure Ganache is running.');
      }
      
      this.account = accounts[0]; // Use first account as default
      console.log('📡 Connected to blockchain network:', this.networkUrl);
      console.log('🔐 Using account:', this.account);
      
      // Deploy contract if not already deployed
      if (!this.contractAddress) {
        await this.deployContract();
      } else {
        // Load existing contract
        this.contract = new this.web3.eth.Contract(CONTRACT_ABI, this.contractAddress);
        console.log('📄 Loaded existing contract at:', this.contractAddress);
      }
      
      return true;
    } catch (error) {
      console.error('❌ Blockchain initialization failed:', error.message);
      return false;
    }
  }

  // Deploy the smart contract
  async deployContract() {
    try {
      console.log('🚀 Deploying CertificateVerification contract...');
      
      const contract = new this.web3.eth.Contract(CONTRACT_ABI);
      
      // Estimate gas
      const gasEstimate = await contract.deploy({
        data: CONTRACT_BYTECODE
      }).estimateGas();
      
      // Deploy contract
      const deployedContract = await contract.deploy({
        data: CONTRACT_BYTECODE
      }).send({
        from: this.account,
        gas: gasEstimate * 2, // Add buffer for safety
        gasPrice: await this.web3.eth.getGasPrice()
      });

      this.contract = deployedContract;
      this.contractAddress = deployedContract.options.address;
      
      console.log('✅ Contract deployed successfully!');
      console.log('📄 Contract address:', this.contractAddress);
      
      // Save contract address to environment file
      this.saveContractAddress();
      
      return this.contractAddress;
    } catch (error) {
      console.error('❌ Contract deployment failed:', error.message);
      throw error;
    }
  }

  // Store certificate hash on blockchain
  async storeCertificateOnBlockchain(certificateId, certificateHash, institutionName, issuerEmail) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please call initialize() first.');
      }

      console.log('⛓️  Storing certificate on blockchain:', certificateId);

      const result = await this.contract.methods.storeCertificate(
        certificateId,
        certificateHash,
        institutionName,
        issuerEmail
      ).send({
        from: this.account,
        gas: 300000 // Adjust gas limit as needed
      });

      console.log('✅ Certificate stored on blockchain!');
      console.log('📄 Transaction hash:', result.transactionHash);
      
      return {
        success: true,
        transactionHash: result.transactionHash,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed
      };

    } catch (error) {
      console.error('❌ Failed to store certificate on blockchain:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Verify certificate on blockchain
  async verifyCertificateOnBlockchain(certificateHash) {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please call initialize() first.');
      }

      console.log('🔍 Verifying certificate on blockchain:', certificateHash);

      const result = await this.contract.methods.verifyCertificate(certificateHash).call();
      
      return {
        isValid: result.isValid,
        certificateId: result.certificateId,
        institutionName: result.institutionName,
        issuerEmail: result.issuerEmail,
        timestamp: result.timestamp
      };

    } catch (error) {
      console.error('❌ Failed to verify certificate on blockchain:', error.message);
      return {
        isValid: false,
        error: error.message
      };
    }
  }

  // Get total certificates count
  async getTotalCertificates() {
    try {
      if (!this.contract) {
        throw new Error('Contract not initialized. Please call initialize() first.');
      }

      const total = await this.contract.methods.getTotalCertificates().call();
      return parseInt(total);

    } catch (error) {
      console.error('❌ Failed to get total certificates:', error.message);
      return 0;
    }
  }

  // Save contract address to environment file
  saveContractAddress() {
    try {
      const envPath = path.join(__dirname, '.env');
      let envContent = '';

      if (fs.existsSync(envPath)) {
        envContent = fs.readFileSync(envPath, 'utf8');
      }

      // Update or add CONTRACT_ADDRESS
      if (envContent.includes('CONTRACT_ADDRESS=')) {
        envContent = envContent.replace(/CONTRACT_ADDRESS=.*/, `CONTRACT_ADDRESS=${this.contractAddress}`);
      } else {
        envContent += `\nCONTRACT_ADDRESS=${this.contractAddress}`;
      }

      fs.writeFileSync(envPath, envContent);
      console.log('💾 Contract address saved to .env file');

    } catch (error) {
      console.error('❌ Failed to save contract address:', error.message);
    }
  }

  // Get blockchain network info
  async getNetworkInfo() {
    try {
      const networkId = await this.web3.eth.net.getId();
      const blockNumber = await this.web3.eth.getBlockNumber();
      const accounts = await this.web3.eth.getAccounts();

      return {
        networkId,
        blockNumber,
        accountsCount: accounts.length,
        contractAddress: this.contractAddress
      };

    } catch (error) {
      console.error('❌ Failed to get network info:', error.message);
      return null;
    }
  }
}

// Export for use in other modules
module.exports = BlockchainService;

// CLI usage for testing
if (require.main === module) {
  const main = async () => {
    const blockchainService = new BlockchainService();
    
    console.log('🔧 Initializing blockchain service...');
    const success = await blockchainService.initialize();
    
    if (success) {
      console.log('🎉 Blockchain service initialized successfully!');
      
      // Test storing a certificate
      const testResult = await blockchainService.storeCertificateOnBlockchain(
        'TEST_CERT_001',
        'abcd1234567890hash',
        'Test University',
        'test@university.edu'
      );
      
      console.log('Test storage result:', testResult);
      
      // Test verifying the certificate
      const verifyResult = await blockchainService.verifyCertificateOnBlockchain('abcd1234567890hash');
      console.log('Test verification result:', verifyResult);
      
      // Get network info
      const networkInfo = await blockchainService.getNetworkInfo();
      console.log('Network info:', networkInfo);
      
    } else {
      console.log('❌ Failed to initialize blockchain service');
      process.exit(1);
    }
  };

  main().catch(console.error);
}