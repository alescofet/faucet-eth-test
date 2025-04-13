# ETH Faucet - Ethereum Test Network Interaction Platform

A comprehensive platform that enables users to interact with Ethereum test networks, featuring a faucet for obtaining test ETH, transfer capabilities, and balance checking functionality. Built with modern web technologies and best practices.

## 🌟 Features

- **ETH Faucet**: Get test ETH tokens for development and testing
- **Wallet Integration**: Seamless MetaMask wallet connection
- **Balance Checking**: View ETH balances for any address
- **Transfer Functionality**: Send test ETH between addresses
- **User-Friendly Interface**: Modern and intuitive UI built with React and Shadcn/UI

## 🏗️ Architecture

The project consists of three main components:

### Frontend (./front)
- React with TypeScript for type safety
- Vite as the build tool for optimal development experience
- Tailwind CSS for styling
- Shadcn/UI for component library
- Context API for wallet state management

### Backend (./back)
- Node.js with TypeScript
- Express.js for REST API
- Web3.js and Ethers.js for blockchain interaction
- CORS and Helmet for security

### Ethereum Node (./nodo)
- Local Ethereum test network configuration
- Genesis block configuration
- Network initialization scripts

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

### Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd faucet-eth-test
```

2. Install dependencies for all components:
```bash
# Install frontend dependencies
cd front
npm install

# Install backend dependencies
cd ../back
npm install
```

3. Configure environment variables:
- Create `.env` files in backend directory
- Set required environment variables as shown below:

#### Backend (.env in /back directory)
```env
PORT=3000
NODE_ENV=development
ETH_NODE_URL=http://127.0.0.1:5556
FAUCET_PRIVATE_KEY=your_ethereum_private_key_here
FAUCET_PASSWORD=your_ethereum_password_here
FAUCET_AMOUNT=10
REQUEST_LIMIT_PER_DAY=30
MIN_TIME_BETWEEN_REQUESTS=3600
```

> Note: Replace `your_ethereum_private_key_here` with the actual private key of the faucet account. Never commit real private keys to version control.

### Running the Application

1. Start the Ethereum test node:
```bash
npm run nodo
```

2. Start the backend server:
```bash
npm run back
```

3. Start the frontend application:
```bash
npm run front
```

## 💻 Usage

1. Connect your MetaMask wallet to the application
2. Select the desired operation:
   - Request test ETH from the faucet
   - Check address balances
   - Transfer ETH between addresses
3. Follow the on-screen instructions to complete your desired operation

## 🔧 Technical Details

### Frontend Architecture
- Utilizes React Context for wallet state management
- Implements responsive design with Tailwind CSS
- Features component-based architecture for maintainability
- Includes TypeScript for enhanced type safety

### Backend Architecture
- RESTful API design
- Implements security best practices with Helmet
- Uses environment variables for configuration
- Includes TypeScript for type safety

### Ethereum Node
- Configurable genesis block
- Custom network parameters
- Development-focused configuration

## 🛡️ Security Considerations

- Implements CORS protection
- Uses Helmet for enhanced API security
- Secure wallet connection handling
- Environment variable management for sensitive data

## 🙏 Acknowledgments

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Shadcn/UI](https://ui.shadcn.com/)
- [Web3.js](https://web3js.readthedocs.io/)
- [Ethers.js](https://docs.ethers.io/)
- [Express.js](https://expressjs.com/)