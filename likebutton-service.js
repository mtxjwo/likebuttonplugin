const web3 = new ethers.providers.AlchemyProvider(
  "homestead",
  "8R44ckgzRQzE9kFCtp7QtGQHU6JcAbdy"
);

const likeTokenContractAddress = "0x0469dFb82A816C5F0a566625Cec09216A721E90e";
const likeTokenAbi = likeButtonABI;

const prepareTransaction = (fromAddress, toAddress, dataSet) => {
  const paymentLoad = {
    chainId: "1",
    from: fromAddress,
    to: toAddress,
    gasLimit: "50000",
    value: "0",
    data: dataSet,
  };
  return paymentLoad;
};

chrome.runtime.onMessageExternal.addListener(
  async (request, sender, sendResponse) => {
    switch (request.request) {
      case "resolve_eth_address_and_get_latest_block":
        {
          const latestBlock = await web3.getBlock("latest");
          const walletAddress = await web3.resolveName(request.walletAddress);
          if (
            latestBlock === null ||
            latestBlock === undefined ||
            walletAddress === null ||
            walletAddress === undefined
          ) {
            sendResponse("ERROR");
          }
          sendResponse({
            blockData: latestBlock,
            walletAddressResolved: walletAddress,
          });
        }
        break;
      case "prepare_transaction":
        {
          const tokenContract = new ethers.Contract(
            likeTokenContractAddress,
            likeTokenAbi,
            web3
          );
          const txData = tokenContract.interface.encodeFunctionData(
            "transfer",
            [request.to, (1 * 10 ** 18).toString()]
          );
          const preparedTx = prepareTransaction(
            request.from,
            likeTokenContractAddress,
            txData
          );
          sendResponse({ txData: preparedTx });
        }
        break;
      default:
        {
          sendResponse("Background: no request found.");
        }
        break;
    }
  }
);

setInterval(() => {
  chrome.tabs.query({}, (d) => {
    for (const t of d) {
      if (JSON.stringify(t).indexOf("https://abs.twimg.com/favicons") > -1) {
        chrome.tabs.executeScript(t.id, { file: "web3.min.js" }, (results) => {
          chrome.tabs.executeScript(t.id, { file: "like-inject.js" }, () => {});
        });
      }
    }
  });
}, 5000);
