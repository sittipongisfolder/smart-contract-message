/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require("@nomiclabs/hardhat-ethers")
module.exports = {
  solidity: "0.7.3",
  defaultNetwork: "ganache",
  networks: {
    hardhat: {},
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ["0x9a07cd068fbdbf75ce22d69848eea850890f59024dddd31438984b33220d3558"],/*private key*/
    },
  },
}