const { expect } = require("chai");
const { ethers } = require("hardhat");
const FiatTokenV2ABI = require("./ABIs/FiatTokenV2.json");
const DFXABI = require("./ABIs/DFX.json");

const dfxCADABI = require("./ABIs/dfxCAD.json");
const { parseUnits } = require("ethers/lib/utils");

describe("Foo", function () {
  let foo;
  this.beforeAll("", async function () {
    // setup Foo contract
    const Foo = await ethers.getContractFactory("Foo");
    foo = await Foo.deploy();
    await foo.deployed();
  });

  it("Can get WETH address from UniswapV2 Router", async function () {
    expect(await foo.getWETHAddress()).to.equal(
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    );
  });

  it("Can mint ourselves 1000 USDC", async function () {
    const { provider } = ethers;
    const user = await provider.getSigner(0);
    const userAddress = await user.getAddress();

    // impersonate the USDC contract owner
    const ownerAddress = "0xFcb19e6a322b27c06842A71e8c725399f049AE3a";
    await provider.send("hardhat_impersonateAccount", [ownerAddress]);
    const owner = await ethers.getSigner(ownerAddress);

    // setup contract
    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    const usdc = new ethers.Contract(usdcAddress, FiatTokenV2ABI, owner);

    const before = await usdc.balanceOf(userAddress);

    // make ourselves the master minter and mint ourselves some USDC
    await usdc.updateMasterMinter(userAddress);
    const amount = ethers.utils.parseUnits("1000", 6);
    await usdc.connect(user).configureMinter(userAddress, amount);
    await usdc.connect(user).mint(userAddress, amount);

    // assertions
    const after = await usdc.balanceOf(userAddress);
    expect(after.sub(before)).to.equal(amount);
  });

  it("Can mint ourselves 1000 CADC", async function () {
    const { provider } = ethers;
    const user = await provider.getSigner(0);
    const userAddress = await user.getAddress();

    //test for CADC -- CAD mint is working now...
    // impersonate the USDC contract owner
    const ownerAddressCADC = "0x3e30d340c83d068d632e11b5a30507ce973d7700"; // updated
    await provider.send("hardhat_impersonateAccount", [ownerAddressCADC]);
    const ownerCADC = await ethers.getSigner(ownerAddressCADC);

    // setup contract
    const cadcAddress = "0xcaDC0acd4B445166f12d2C07EAc6E2544FbE2Eef"; // CADC
    const cadc = new ethers.Contract(cadcAddress, FiatTokenV2ABI, ownerCADC);

    const beforeCADC = await cadc.balanceOf(userAddress);

    // make ourselves the master minter and mint ourselves some USDC
    await cadc.updateMasterMinter(userAddress);
    const amountCADC = ethers.utils.parseUnits("1000", 6);
    await cadc.connect(user).configureMinter(userAddress, amountCADC);
    await cadc.connect(user).mint(userAddress, amountCADC);

    // assertions
    const afterCADC = await cadc.balanceOf(userAddress);
    expect(afterCADC.sub(beforeCADC)).to.equal(amountCADC);
  });

  it("Can mint ourselves 1000 DFX", async function () {
    const { provider } = ethers;
    const user = await provider.getSigner(0);
    const userAddress = await user.getAddress();

    //try the DFX mint next...
    // impersonate the USDC contract owner
    const ownerAddressDFX = "0x27E843260c71443b4CC8cB6bF226C3f77b9695AF"; // updated
    await provider.send("hardhat_impersonateAccount", [ownerAddressDFX]);
    const ownerDFX = await ethers.getSigner(ownerAddressDFX);

    // setup contract
    const DFXAddress = "0x888888435FDe8e7d4c54cAb67f206e4199454c60"; // DFX
    const DFX = new ethers.Contract(DFXAddress, DFXABI, ownerDFX);

    const beforeDFX = await DFX.balanceOf(userAddress);

    // make ourselves the master minter and mint ourselves some USDC

    const amountDFX = ethers.utils.parseUnits("1000", 6);
    await DFX.connect(ownerDFX).approve(userAddress, amountDFX);
    //await DFX.connect(user).increaseAllowance(userAddress, amount);
    await DFX.connect(ownerDFX).mint(userAddress, amountDFX);

    // assertions
    const afterDFX = await DFX.balanceOf(userAddress);
    expect(afterDFX.sub(beforeDFX)).to.equal(amountDFX);
  });

  it("Can mint ourselves 1000 dfxCAD", async function () {
    const { provider } = ethers;
    const user = await provider.getSigner(0);
    const userAddress = await user.getAddress();

    //CADC contract
    const ownerAddressCADC = "0x3e30d340c83d068d632e11b5a30507ce973d7700"; // updated
    await provider.send("hardhat_impersonateAccount", [ownerAddressCADC]);
    const ownerCADC = await ethers.getSigner(ownerAddressCADC);

    // setup contract
    const cadcAddress = "0xcaDC0acd4B445166f12d2C07EAc6E2544FbE2Eef"; // CADC
    const cadc = new ethers.Contract(cadcAddress, FiatTokenV2ABI, ownerCADC);

    //add some CADC
    await cadc.updateMasterMinter(userAddress);
    const amountCADC = ethers.utils.parseUnits("1000", 6);
    await cadc.connect(user).configureMinter(userAddress, amountCADC);
    await cadc.connect(user).mint(userAddress, amountCADC);

    //DFX contract
    const ownerAddressDFX = "0x27E843260c71443b4CC8cB6bF226C3f77b9695AF"; // updated
    await provider.send("hardhat_impersonateAccount", [ownerAddressDFX]);
    const ownerDFX = await ethers.getSigner(ownerAddressDFX);

    // setup contract
    const DFXAddress = "0x888888435FDe8e7d4c54cAb67f206e4199454c60"; // DFX
    const DFX = new ethers.Contract(DFXAddress, DFXABI, ownerDFX);

    //add some dfx
    const amountDFX = ethers.utils.parseUnits("1000", 6);
    await DFX.connect(ownerDFX).approve(userAddress, amountDFX);
    //await DFX.connect(user).increaseAllowance(userAddress, amount);
    await DFX.connect(ownerDFX).mint(userAddress, amountDFX);

    //for dfxCAD
    //probably don't need owner account
    //const ownerAddressdfxCAD = "0x27e843260c71443b4cc8cb6bf226c3f77b9695af"; // updated
    //await provider.send("hardhat_impersonateAccount", [ownerAddressdfxCAD]);
    //const ownerdfxCAD = await ethers.getSigner(ownerAddressdfxCAD);

    const dfxCADAddress = "0xFE32747d0251BA92bcb80b6D16C8257eCF25AB1C"; // DFX
    const dfxCAD = new ethers.Contract(dfxCADAddress, dfxCADABI);

    //const beforedfxCAD = await dfxCAD.balanceOf(userAddress);
    //console.log("beforedfxCAD:", beforedfxCAD);

    await cadc
      .connect(user)
      .approve(dfxCADAddress, ethers.constants.MaxUint256);
    await DFX.connect(user).approve(dfxCADAddress, ethers.constants.MaxUint256);

    const amountdfxCADC = ethers.utils.parseUnits("500", 6);
    await dfxCAD.connect(user).mint(userAddress, parseUnits("500"));
  });

  it("Can swap USDC -> ETH", async function () {
    const { provider, utils } = ethers;
    const user = await provider.getSigner(0);
    const userAddress = await user.getAddress();

    // setup contract
    const usdcAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"; // USDC
    const usdc = new ethers.Contract(usdcAddress, FiatTokenV2ABI, user);

    const amount = utils.parseUnits("1000", 6);

    // approval for contract to spend my USDC
    await usdc.approve(foo.address, amount);

    // record balances before swap
    const usdcBefore = await usdc.balanceOf(userAddress);
    const ethBefore = await provider.getBalance(userAddress);

    // execute swap
    await foo.connect(user).swapUSDCToEth(amount, ethers.constants.Zero);

    // record balances after swap
    const usdcAfter = await usdc.balanceOf(userAddress);
    const ethAfter = await provider.getBalance(userAddress);

    // assertions
    const usdcLost = utils.formatUnits(usdcBefore.sub(usdcAfter), 6);
    const ethGained = utils.formatEther(ethAfter.sub(ethBefore));
    expect(usdcLost).to.equal("1000.0");
    expect(ethGained).to.equal("0.382814971421528175");
  });
});
