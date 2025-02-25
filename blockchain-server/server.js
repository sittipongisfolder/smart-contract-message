require("dotenv").config();
const express = require("express");
const Web3 = require("web3");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const web3 = new Web3("http://127.0.0.1:7545"); // เชื่อมต่อ Ganache
async function checkContract() {
  const code = await web3.eth.getCode("0x8FDb9e4A483a6bB0c02a906C0e51A8Be09c90ccA");
  console.log("Contract Code:", code);
}
checkContract();


console.log("RPC URL:http://127.0.0.1:7545", process.env.INFURA_RPC_URL);
console.log("Contract Address:0x8FDb9e4A483a6bB0c02a906C0e51A8Be09c90ccA", process.env.CONTRACT_ADDRESS);



const contractABI = [
    {
      "constant": false,
      "inputs": [{"name": "newMessage", "type": "string"}],
      "name": "update", // ✅ เปลี่ยนเป็น `update`
      "outputs": [],
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "message", // ✅ เปลี่ยนเป็น `message` เพราะเป็น public variable
      "outputs": [{"name": "", "type": "string"}],
      "type": "function"
    }
  ];
  

const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);

let messageHistory = [];

// ✅ Route ดึงข้อความจาก Smart Contract
app.get("/message", async (req, res) => {
    try {
        const message = await contract.methods.message().call();
        res.json({ message, history: messageHistory });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});

app.post("/message", async (req, res) => {
    try {
        const { message } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        // ✅ ดึงข้อความเก่าก่อนอัปเดต // Sittipong Wongsuwan
        const oldMessage = await contract.methods.message().call();
        
        // ✅ บันทึกข้อความเก่าลงใน Memory (Array)
        messageHistory.push({ oldMessage, timestamp: new Date().toISOString() });

        const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
        web3.eth.accounts.wallet.add(account);

        const gas = await contract.methods.update(message).estimateGas({ from: account.address });

        const result = await contract.methods.update(message).send({ 
            from: account.address, 
            gas: gas + 100000  
        });

        res.json({ success: true, transactionHash: result.transactionHash, history: messageHistory });
    } catch (error) {
        res.status(500).json({ error: error.toString() });
    }
});



// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
