if (typeof web3 === "undefined") {
  web3 = AlchemyWeb3.createAlchemyWeb3(
    "https://eth-mainnet.g.alchemy.com/v2/8R44ckgzRQzE9kFCtp7QtGQHU6JcAbdy"
  );
}

if (typeof wallet === "undefined") {
  wallet = {
    address: null,
    balanceChecking: false,
  };
}

if (proxyDebug === true) {
  document.getElementById("log").style.display = "block";
}

const getWalletAddress = (callback = null) => {
  chrome.runtime.sendMessage(
    proxyAppId,
    { request: "get_ethereum_selected_account" },
    (r) => {
      wallet.address = r;
      if (callback !== null) {
        callback();
      }
    }
  );
};

const getBalance = () => {
  if (wallet.balanceChecking === true) {
    return;
  }
  wallet.balanceChecking = true;
  web3.alchemy
    .getTokenBalances(web3.utils.toChecksumAddress(wallet.address), [
      web3.utils.toChecksumAddress(likeTokenContractAddress),
    ])
    .then((r) => {
      balanceChecking = false;
      document.getElementById("log").append("Balance result..." + r + "\n");

      if (r === null) {
        return;
      }
      document.getElementById("co-loading-container").style.display = "none";
      document.getElementById("co-token-balance").style.display = "inline-flex";
      document.getElementById("co-token-balance").innerText =
        web3.utils.fromWei(r.tokenBalances[0].tokenBalance) + " Tokens";
    })
    .catch((e) => {
      document
        .getElementById("log")
        .append("Balance result error...\n" + JSON.stringify(e) + "\n");
    });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (proxyDebugShowRequestsDetails === true) {
    document
      .getElementById("log")
      .append("Request received:" + request.request + "\n");
  }
  switch (request.request) {
    case "set_address_in_popup":
      {
        wallet.address = request.walletAddress;
        document
          .getElementById("log")
          .append("Getting balance..." + request.walletAddress + "\n");
        getBalance();
        sendResponse("Request received.");
      }
      break;
    default:
      {
        sendResponse("ERROR");
      }
      break;
  }
});

const initPopup = () => {
  getWalletAddress(getBalance);
};

initPopup();
