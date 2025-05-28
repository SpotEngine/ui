// Arbitrum Mainnet Configuration
const ARBITRUM_MAINNET = {
    chainId: '0xa4b1', // 42161 in hex
    chainName: 'Arbitrum One',
    nativeCurrency: {
        name: 'Ether',
        symbol: 'ETH',
        decimals: 18
    },
    rpcUrls: ['https://arb1.arbitrum.io/rpc'],
    blockExplorerUrls: ['https://arbiscan.io'],
    iconUrls: ['https://arbitrum.io/assets/arbitrum_logo.svg']
};

let provider;
let signer;

// Wait for ethers to be loaded
window.addEventListener('load', function() {
    if (typeof ethers === 'undefined') {
        showError('Failed to load ethers.js library. Please refresh the page.');
        return;
    }
});


// Initialize Web3
async function initWeb3() {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        return true;
    }
    return false;
}
// Check Initial Connection Status
async function checkInitialConnection() {
    try {
        if (!await initWeb3()) {
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
            userWalletAddress = accounts[0];
            signer = provider.getSigner();
            
            // Add event listeners
            window.ethereum.on('accountsChanged', handleAccountsChanged);
            window.ethereum.on('chainChanged', handleChainChanged);
        }

        updateUI();
        checkNetwork();
    } catch (error) {
        console.error('Error checking initial connection:', error);
    }
}

// Connect Wallet
async function connectWallet() {
    try {
        if (!await initWeb3()) {
            showError('MetaMask is not installed. Please install MetaMask to continue.');
            return;
        }

        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        userWalletAddress = accounts[0];
        signer = provider.getSigner();
        

        updateUI();
        checkNetwork();

        // Listen for account changes
        window.ethereum.on('accountsChanged', handleAccountsChanged);
        // Listen for chain changes
        window.ethereum.on('chainChanged', handleChainChanged);
    } catch (error) {
        showError('Failed to connect wallet: ' + error.message);
    }
}


// Switch Network
async function switchNetwork() {
    try {
        // First try to switch to the network
        try {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: ARBITRUM_MAINNET.chainId }],
            });
        } catch (switchError) {
            // If the network is not added to MetaMask, add it
            if (switchError.code === 4902) {
                try {
                    await window.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [ARBITRUM_MAINNET],
                    });
                } catch (addError) {
                    if (addError.code === -32602) {
                        showError('Invalid network configuration. Please try again later.');
                    } else {
                        showError('Failed to add Arbitrum: ' + addError.message);
                    }
                }
            } else if (switchError.code === -32002) {
                showError('Please check your MetaMask wallet and approve the network switch.');
            } else {
                showError('Failed to switch network: ' + switchError.message);
            }
        }
    } catch (error) {
        showError('Error switching network: ' + error.message);
    }
}

// Check Network
async function checkNetwork() {
    try {
        const chainId = await window.ethereum.request({ method: 'eth_chainId' });
        const isArbitrum = chainId === ARBITRUM_MAINNET.chainId;
        
        document.getElementById('network-status').textContent = isArbitrum ? 'Arbitrum One' : 'Wrong Network';
        document.getElementById('switch-network').style.display = isArbitrum ? 'none' : 'inline-block';
    } catch (error) {
        showError('Error checking network: ' + error.message);
    }
}

// Update UI
function updateUI() {
    const connectButton = document.getElementById('connect-wallet');
    if (userWalletAddress) {
        document.getElementById('connection-status').textContent = 'Connected';
        document.getElementById('wallet-address').textContent = 
            `${userWalletAddress.substring(0, 6)}...${userWalletAddress.substring(38)}`;
        connectButton.style.display = 'none';
    } else {
        document.getElementById('connection-status').textContent = 'Not Connected';
        document.getElementById('wallet-address').textContent = 'Not Connected';
        connectButton.style.display = 'inline-block';
    }
}

// Event Handlers
function handleAccountsChanged(accounts) {
    if (accounts.length === 0) {
        userWalletAddress = null;
    } else {
        userWalletAddress = accounts[0];
    }
    updateUI();
}

function handleChainChanged() {
    checkNetwork();
}

// Error Handling
function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error-modal').style.display = 'block';
}

function closeErrorModal() {
    document.getElementById('error-modal').style.display = 'none';
}

// Mobile Detection
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

// // Initialize
// const connectButton = document.getElementById('connect-wallet');
// const switchButton = document.getElementById('switch-network');

// connectButton.addEventListener('click', connectWallet);
// switchButton.addEventListener('click', switchNetwork);

// Check initial connection status
// checkInitialConnection();

// Check if MetaMask is installed
if (typeof window.ethereum === 'undefined') {
    showError('MetaMask is not installed. Please install MetaMask to continue.');
}

// Handle mobile deep linking
if (isMobile()) {
    connectButton.addEventListener('click', () => {
        window.location.href = 'https://metamask.app.link/dapp/' + window.location.hostname;
    });
}