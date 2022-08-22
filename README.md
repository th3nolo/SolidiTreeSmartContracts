# SolidiTree Smart Conctracts

ChariFi platform to benefit tree planting in areas affected from deforestation by staking funds on Aave v3 pools.

Project commands

```shell
yarn install 
yarn hardhat compile
yarn hardhat node --fork https://polygon-mumbai.g.alchemy.com/v2/<key> 
yarn hardhat run scripts/NftTest.js  
yarn hardhat run scripts/NftDeployment.js --network mumbai
yarn hardhat run scripts/AAVE.js 
```
https://polygon-mumbai.g.alchemy.com/v2/<key\> 

<key> in key change it for the API of your [alchemy node](https://www.alchemy.com/)

Networks available. { ropsten, mumbai } 

You got 3 scripts, 2 tests, 1 deployment,

The NftTest.js check the whitelisting process after depositing in the protocol, and also the events of resuming. 
For this to work you need to deploy the NFT first, then the Wrapper, and Set the underlying asset and the Address of the NFT to set the Whitelisting roles.

Use --network if you want to use this script in any other network than a local node.

The NftDeployment script is used to deploy the contracts to the testnet, at the end of the execution it gives you the address of:
  
- Nft Contract Adress
- Token Contract Adress
- Protocol Contract Adress 
  
The AAVE.js script lets you impersonate an account with a high USDT balance, so you can check the integration with the AAVE protocol, but for this, you need to --fork the mainnet. 
  
documentation:  
- https://hardhat.org/hardhat-network/docs/guides/forking-other-networks
  
you already have this command, yarn hardhat node --fork https://polygon-mumbai.g.alchemy.com/v2/<key\> change the key with your API key of an alchemy node.
  
then run yarn hardhat run scripts/AAVE.js w/o network to use your forked node of mumbai.
  
For other networks, you need.
>1. Pool-Proxy-{network} 
>2. The Underlying Asset Adress {Asset to deposit, in our case USDT}
  
1. https://docs.aave.com/developers/deployed-contracts/v3-testnet-addresses
2. https://docs.aave.com/developers/deployed-contracts/v3-mainnet

.env.example
```
PRIVATE_KEY = ""
ALCHEMY_ENDPOINT_RINKEBY = "https://eth-rinkeby.alchemyapi.io/v2/<key>"
ALCHEMY_ENDPOINT_MUMBAI = "https://polygon-testnet.blastapi.io/<key>"
RELAYER_API_KEY = "https://polygon-mumbai.g.alchemy.com/v2/<key>"
RELAYER_SECRET_KEY = ""
```


