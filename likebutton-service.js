const web3 = new ethers.providers.AlchemyProvider(
  "homestead",
  "8R44ckgzRQzE9kFCtp7QtGQHU6JcAbdy"
);

let qualifiedTabId;
const wallet = {
  walletAddress: null,
  tx: null,
};

const getEthereumAccounts = async (tabId) => {
  const name = "ethereum";
  const [{ result }] = await chrome.scripting.executeScript({
    func: async (name) => {
      const r = await window[name].request({ method: "eth_requestAccounts" });
      return r;
    },
    args: [name],
    target: {
      tabId,
    },
    world: "MAIN",
  });
  if (result !== null) {
    wallet.walletAddress = result[0];
  }
};

const sendEthereumTransaction = async (tabId, txData) => {
  const name = "ethereum";
  const [{ result }] = await chrome.scripting.executeScript({
    func: async (name, tx) => {
      const r = await window[name]
        .request({
          method: "eth_sendTransaction",
          params: [tx],
        })
        .catch((e) => {
          return "TRANSACTION_FAILED";
        });
      return r;
    },
    args: [name, txData],
    target: {
      tabId,
    },
    world: "MAIN",
  });
  if (result !== null && result !== "TRANSACTION_FAILED") {
    wallet.tx = result;
  } else {
    wallet.tx = "TRANSACTION_FAILED";
  }
};

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

chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
  if ("request" in request === false) {
    return;
  }
  switch (request.request) {
    case "get_send_status":
      {
        if (wallet.tx === null) {
          sendResponse("ERROR");
          return;
        }
        sendResponse(wallet.tx);
      }
      break;
    case "get_ethereum_selected_account":
      {
        if (wallet.walletAddress === null) {
          sendResponse("ERROR");
          return;
        }
        sendResponse(wallet.walletAddress);
      }
      break;
    case "get_ethereum_accounts":
      {
        getEthereumAccounts(qualifiedTabId);
        sendResponse("Request received.");
      }
      break;
    case "send_like_button":
      {
        wallet.tx = null;
        const latestBlock = await web3.getBlock("latest");
        const walletAddressReceiver = await web3.resolveName(
          request.walletAddress
        );
        if (
          latestBlock === null ||
          latestBlock === undefined ||
          walletAddressReceiver === null ||
          walletAddressReceiver === undefined
        ) {
          sendResponse("ERROR");
          return;
        }
        const tokenContract = new ethers.Contract(
          likeTokenContractAddress,
          likeButtonABI,
          web3
        );
        const txData = tokenContract.interface.encodeFunctionData("transfer", [
          walletAddressReceiver,
          (1 * 10 ** 18).toString(),
        ]);
        const preparedTx = prepareTransaction(
          wallet.walletAddress,
          likeTokenContractAddress,
          txData
        );
        sendEthereumTransaction(qualifiedTabId, preparedTx);
        sendResponse("Request received.");
      }
      break;
    default:
      {
        sendResponse("Background: no request found.");
      }
      break;
  }
});

const query = () => {
  chrome.tabs.query({}, (d) => {
    for (const t of d) {
      if (JSON.stringify(t).indexOf("https://abs.twimg.com/favicons") > -1) {
        qualifiedTabId = t.id;
        if (wallet.walletAddress === null) {
          getEthereumAccounts(qualifiedTabId);
        }
        chrome.scripting.executeScript(
          {
            target: { tabId: t.id, allFrames: true },
            files: [
              "web3.min.js",
              "party.min.js",
              "appid.js",
              "like-inject.js",
            ],
          },
          (results) => {}
        );
      }
    }
  });
};

setInterval(() => {
  query();
}, 5000);
query();
