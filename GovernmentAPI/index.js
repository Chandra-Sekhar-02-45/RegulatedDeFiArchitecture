require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const ethers = require('ethers');
const cors = require('cors');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Could not connect to MongoDB', err));

const PORT = process.env.PORT || 5001;

// Health check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Government API is up and running' });
});

// Government Wallet for signing
const govWallet = new ethers.Wallet(process.env.GOVERNMENT_PRIVATE_KEY);

/**
 * @route   POST /api/verify
 * @desc    Verify Aadhaar/PAN and sign wallet address
 * @access  Public (In production, this would be highly restricted)
 */
app.post('/api/verify', async (req, res) => {
    try {
        const { walletAddress, aadhaar, pan } = req.body;

        if (!walletAddress || !aadhaar || !pan) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Simulate KYC Validation (In real world, verify with Govt databases)
        // For this prototype, we'll assume any input with correct length is valid
        if (aadhaar.length !== 12 || pan.length !== 10) {
            return res.status(400).json({ error: 'Invalid document format' });
        }

        // 2. Check if user already exists
        let user = await User.findOne({ walletAddress });

        if (user && user.isVerified) {
            return res.status(200).json({
                message: 'User already verified',
                signature: user.signature
            });
        }

        // 3. Generate Cryptographic Signature
        // MUST match getMessageHash(address, uint256) in IdentityRegistry.sol
        const nonce = user ? (user.registrationNonce || 0) : 0;
        const messageHash = ethers.solidityPackedKeccak256(["address", "uint256"], [walletAddress, nonce]);

        // signMessage automatically adds the "\x19Ethereum Signed Message:\n32" prefix
        const signature = await govWallet.signMessage(ethers.getBytes(messageHash));

        // 4. Save to Database
        if (!user) {
            user = new User({ walletAddress, aadhaar, pan });
        }
        user.isVerified = true;
        user.signature = signature;
        user.registrationNonce = (user.registrationNonce || 0) + 1;
        await user.save();

        res.status(200).json({
            message: 'Verification successful',
            walletAddress,
            signature
        });

    } catch (error) {
        console.error('Verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

/**
 * @route   GET /api/status/:address
 * @desc    Check verification status
 */
app.get('/api/status/:address', async (req, res) => {
    try {
        const user = await User.findOne({ walletAddress: req.params.address.toLowerCase() });
        if (!user) {
            return res.status(404).json({ verified: false });
        }
        res.status(200).json({
            verified: user.isVerified,
            signature: user.signature
        });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(PORT, () => {
    console.log(`Government API running on port ${PORT}`);
    console.log(`Government Signer Address: ${govWallet.address}`);
});
