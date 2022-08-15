const main = async () => {
  async function deploy(name, ...params) {
    const Contract = await ethers.getContractFactory(name);
    return await Contract.deploy(...params).then((f) => f.deployed());
  }

  [owner, user1, user2] = await ethers.getSigners();

  // console.log(await owner.address);
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
  console.log("NFT Contract doployed to:", NFT.address);
  //console.log("\n")
  let tx;
  // It's like keccak256 in the Smart Contract
  let whitelisted = ethers.utils.id("WHITE_LISTED_ROLE");
  let contract = ethers.utils.id("SMART_CONTRACT_ROLE");
  tx = await NFT.grantRole(contract, tokenWrapper.address);  
  console.log(tx);
  //console.log(tx)
  tx = await token.transfer(user1.address, ethers.utils.parseEther("1"));
  //console.log(tx)
  tx = await token
    .connect(user1)
    .approve(tokenWrapper.address, ethers.utils.parseEther("1"));
  console.log(tx);
  tx = await tokenWrapper.connect(user1).deposit(1);
  console.log(tx);
  tx = await token.approve(tokenWrapper.address, ethers.utils.parseEther("1"));
  console.log(tx);
  tx = await tokenWrapper.deposit(1)
  console.log(tx);
  tx = await NFT.safeMint()
  console.log(tx)
  //await hardhatToken.connect(addr1).transfer(addr2.address, 50);
  tx = await NFT.connect(user1).safeMint();
  console.log(tx);
  tx = await NFT.balanceOf(owner.address);
  console.log(tx);
  tx = await NFT.balanceOf(user1.address);
  console.log(tx);
  tx = await NFT.tokenURI(1);
  console.log(tx);
  tx = await NFT.tokenURI(2);
  console.log(tx);
  //tx = await NFT.transferFrom(owner.address, user1.address, 1);
  //tx = await NFT.safeMint()
  //console.log(tx)
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
