const main = async () => {
  async function deploy(name, ...params) {
    const Contract = await ethers.getContractFactory(name);
    return await Contract.deploy(...params).then((f) => f.deployed());
  }

  this.SolidiTreeNft = await deploy("SolidiTreeNft");
  let NFT = await this.SolidiTreeNft.deployed();
  this.Token = await deploy("MyToken"); // ERC20 to Deposit
  let token = await this.Token.deployed();
  this.WrappableToken = await deploy(
    "SolidiTreeProtocol",
    token.address,
    "SolidiTreeUSDT",
    "soltUSDT",
    NFT.address
  );
  let tokenWrapper = await this.WrappableToken.deployed();
  console.log("Nft Contract Adress:", NFT.address);
  console.log("Token Contract Adress:", token.address);
  console.log("Protocol Contract Adress:", tokenWrapper.address);
  let tx;
  // It's like keccak256 in the Smart Contract
  let whitelisted = ethers.utils.id("WHITE_LISTED_ROLE");
  let contract = ethers.utils.id("SMART_CONTRACT_ROLE");
  tx = await NFT.grantRole(contract, tokenWrapper.address);
};

const runMain = async () => {
  try {
    await main();

    process.exit(0);
  } catch (error) {
    console.log(error);

    process.exit(1);
  }
};

runMain();
