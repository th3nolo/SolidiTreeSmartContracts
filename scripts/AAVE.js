const helpers = require("@nomicfoundation/hardhat-network-helpers");

const main = async () => {
  async function deploy(name, ...params) {
    const Contract = await ethers.getContractFactory(name);
    return await Contract.deploy(...params).then((f) => f.deployed());
  }

  const impersonatedaddress = "0xfa5af701806b191d9bf2ada89750bad2198e1deb";
  await helpers.impersonateAccount(impersonatedaddress);
  const impersonatedSigner = await ethers.getSigner(impersonatedaddress);
  console.log("impersonatedSigner address:", impersonatedSigner);
  this.SolidiTreeNft = await deploy("SolidiTreeNft");
  let NFT = await this.SolidiTreeNft.deployed();
  let Token = await ethers.getContractFactory("ERC20"); // ERC20 to Deposit
  let token = await Token.attach("0x21C561e551638401b937b03fE5a0a0652B99B7DD")  
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
  let contract = ethers.utils.id("SMART_CONTRACT_ROLE");
  tx = await NFT.grantRole(contract, tokenWrapper.address);
  tx = await token.balanceOf(impersonatedSigner.address);
  console.log(tx)
  tx = await token
  .connect(impersonatedSigner)
  .approve(tokenWrapper.address, ethers.utils.parseEther("100"));
  //console.log(tx);
  tx = await tokenWrapper.connect(impersonatedSigner).deposit(100);
  tx = await tokenWrapper.balanceOf(impersonatedSigner.address);
  console.log(tx)

  //tx = await tokenWrapper
  //.connect(impersonatedSigner)
  //.approve(tokenWrapper.address, ethers.utils.parseEther("100"));
  tx = await tokenWrapper.connect(impersonatedSigner).withdraw(100);
  tx = await tokenWrapper.balanceOf(impersonatedSigner.address);
  console.log(tx)
  tx = await token.balanceOf(impersonatedSigner.address);
  console.log(tx)
  tx = await token.balanceOf(tokenWrapper.address);
  console.log(tx)
  tx = await tokenWrapper.balanceOf(impersonatedSigner.address);
  console.log(tx)
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
