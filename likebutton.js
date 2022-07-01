if (typeof web3 === "undefined") {
  web3 = AlchemyWeb3.createAlchemyWeb3(
    "https://eth-mainnet.g.alchemy.com/v2/8R44ckgzRQzE9kFCtp7QtGQHU6JcAbdy"
  );
}

const likeTokenContractAddress = "0x0469dFb82A816C5F0a566625Cec09216A721E90e";

const wallet = {
  address: null,
};

const getBalance = () => {
  setTimeout(() => {
    web3.alchemy
      .getTokenBalances(web3.utils.toChecksumAddress(wallet.address), [
        web3.utils.toChecksumAddress(likeTokenContractAddress),
      ])
      .then((r) => {
        if (r === null) {
          return;
        }
        document.getElementById("co-loading-container").style.display = "none";
        document.getElementById("co-token-balance").style.display =
          "inline-flex";
        document.getElementById("co-token-balance").innerText =
          web3.utils.fromWei(r.tokenBalances[0].tokenBalance) + " Tokens";
      });
  });
};

chrome.runtime.onMessageExternal.addListener(function (
  request,
  sender,
  sendResponse
) {
  switch (request.request) {
    case "set_address_in_popup":
      {
        wallet.address = request.walletAddress;
        getBalance();
      }
      break;
    default:
      {
        sendResponse("Popup: no request found.");
      }
      break;
  }
});
