require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    hardhat: {
      chainId: 1337,
    },
  },
};
// module.exports = {
//   networks: {
//     sepolia: {
//       url: "http://127.0.0.1:8545",
//       accounts: {
//         mnemonic: "test test test test test test test test test test test junk",
//         path: "m/44'/60'/0'/0",
//         initialIndex: 0,
//         count: 20,
//         passphrase: "",
//       },
//     },
//   },
// };

// module.exports = {
//   defaultNetwork: "sepolia",
//   networks: {
//     hardhat: {
//     },
//     sepolia: {
//       url: "https://sepolia.infura.io/v3/<key>",
//       accounts: [privateKey1, privateKey2, ...]
//     }
//   },
//   solidity: {
//     version: "0.8.27",
//     settings: {
//       optimizer: {
//         enabled: true,
//         runs: 200
//       }
//     }
//   },
//   paths: {
//     sources: "./contracts",
//     tests: "./test",
//     cache: "./cache",
//     artifacts: "./artifacts"
//   },
//   mocha: {
//     timeout: 40000
//   }
// }