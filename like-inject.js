/**
 *
 * EXTENSION REQUESTS TYPES
 * - "set_address_in_popup" - sets the address in the popup
 * - "send_like_button" - asks the background page to resolve the address of a .eth name and info on latest block
 * - "prepare_transaction" - ask the background to create a serialised transaction
 * - "get_ethereum_accounts" - ask the background to invoke metamask connect account(s)
 * - "get_ethereum_selected_account" - get selectd accounts
 */

if (typeof proxyConnected === "undefined") {
  proxyConnected = false;
  proxyIsConnecting = false;
}

if (typeof proxyStylesInjected === "undefined") {
  const twitterHead = document.getElementsByTagName("head")[0];
  const proxyStyles = `  
  .co-spinner {
    margin: 0px auto;
    animation: rotation 0.6s infinite linear;
    border-style: solid;
    border-width: 3px;
    border-color: lightgray;
    border-top-color: rgb(29, 155, 240);
    border-radius: 100%;
  }
  @-webkit-keyframes rotation {
    from {
      -webkit-transform: rotate(0deg);
    }
    to {
      -webkit-transform: rotate(359deg);
    }
  }
  @-moz-keyframes rotation {
    from {
      -moz-transform: rotate(0deg);
    }
    to {
      -moz-transform: rotate(359deg);
    }
  }
  @-o-keyframes rotation {
    from {
      -o-transform: rotate(0deg);
    }
    to {
      -o-transform: rotate(359deg);
    }
  }
  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }`;
  const mainStylesProxy = document.createElement("style");
  mainStylesProxy.setAttribute("type", "text/css");
  mainStylesProxy.appendChild(document.createTextNode(proxyStyles));
  twitterHead.appendChild(mainStylesProxy);
  proxyStylesInjected = true;
}

if (typeof proxyConnectModal === "undefined") {
  proxyConnectModal = document.createElement("div");
  proxyConnectModal.setAttribute("id", "proxyConnect");
  proxyConnectModal.style.zIndex = "1000000";
  proxyConnectModal.style.position = "fixed";
  proxyConnectModal.style.display = "flex";
  proxyConnectModal.style.flexDirection = "row";
  proxyConnectModal.style.alignItems = "center";
  proxyConnectModal.style.justifyContent = "center";
  proxyConnectModal.style.top = "0";
  proxyConnectModal.style.left = "0";
  proxyConnectModal.style.textAlign = "center";
  proxyConnectModal.style.width = "100%";
  proxyConnectModal.style.height = "100%";
  proxyConnectModal.style.backgroundColor = "rgba(0,0,0,0.3)";
  document.body.appendChild(proxyConnectModal);
}

if (typeof proxyConnectButtonContainer === "undefined") {
  proxyConnectButtonContainer = document.createElement("div");
  proxyConnectButtonContainerNotice = document.createElement("div");
  proxyConnectCloseButton = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "svg"
  );
  proxyConnectCloseButtonPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  proxyConnectButton = document.createElement("button");
  proxyConnectButtonContainer.style.padding = "20px 20px 20px 20px";
  proxyConnectButtonContainer.style.fontFamily =
    "TwitterChirp, -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif";
  proxyConnectButtonContainer.style.display = "flex";
  proxyConnectButtonContainer.style.flex = "0 0 400px";
  proxyConnectButtonContainer.style.flexDirection = "column";
  proxyConnectButtonContainer.style.alignItems = "center";
  proxyConnectButtonContainer.style.justifyContent = "center";
  proxyConnectButtonContainer.style.rowGap = "20px";
  proxyConnectButtonContainer.style.backgroundColor = "#ffffff";
  proxyConnectButtonContainer.style.borderRadius = "16px";
  proxyConnectCloseButton.style.position = "absolute";
  proxyConnectCloseButton.style.borderRadius = "50px";
  proxyConnectCloseButton.style.top = window.innerHeight / 2 - 95 + "px";
  proxyConnectCloseButton.style.left = window.innerWidth / 2 + 200 - 30 + "px";
  proxyConnectCloseButton.style.opacity = "0.3";
  proxyConnectCloseButton.style.cursor = "pointer";
  proxyConnectCloseButton.style.padding = "5px";
  proxyConnectCloseButton.setAttribute("viewBox", "0 0 24 24");
  proxyConnectCloseButton.setAttribute("width", "24");
  proxyConnectCloseButton.setAttribute("height", "24");
  proxyConnectCloseButtonPath.setAttribute(
    "d",
    "M13.414 12l5.793-5.793c.39-.39.39-1.023 0-1.414s-1.023-.39-1.414 0L12 10.586 6.207 4.793c-.39-.39-1.023-.39-1.414 0s-.39 1.023 0 1.414L10.586 12l-5.793 5.793c-.39.39-.39 1.023 0 1.414.195.195.45.293.707.293s.512-.098.707-.293L12 13.414l5.793 5.793c.195.195.45.293.707.293s.512-.098.707-.293c.39-.39.39-1.023 0-1.414L13.414 12z"
  );
  proxyConnectCloseButton.appendChild(proxyConnectCloseButtonPath);
  proxyConnectCloseButton.onmouseover = () => {
    proxyConnectCloseButton.style.backgroundColor = "rgba(0,0,0,0.25)";
  };
  proxyConnectCloseButton.onmouseout = () => {
    proxyConnectCloseButton.style.backgroundColor = "transparent";
  };
  proxyConnectCloseButton.onclick = () => {
    proxyConnectModal.style.display = "none";
  };
  proxyConnectButton.style.backgroundColor = "rgb(29, 155, 240)";
  proxyConnectButton.style.boxShadow = "rgb(0 0 0 / 8%) 0px 8px 28px";
  proxyConnectButton.style.padding = "15px 20px 15px 20px";
  proxyConnectButton.style.flex = "0 0 60%";
  proxyConnectButton.style.width = "50%";
  proxyConnectButton.style.alignItems = "center";
  proxyConnectButton.style.justifyContent = "center";
  proxyConnectButton.style.cursor = "pointer";
  proxyConnectButton.style.border = "0";
  proxyConnectButton.style.color = "#ffffff";
  proxyConnectButton.style.borderRadius = "50px";
  changeConnectButtonStatus = (status) => {
    if (status === "LOADING") {
      proxyConnectButton.style.backgroundColor = "rgb(236, 236, 236)";
      proxyConnectButton.style.paddingTop = "12px";
      proxyConnectButton.style.paddingBottom = "12px";
      proxyConnectButton.innerHTML =
        "<div class='co-spinner' style='width: 15px; height: 15px;'></div>";
    } else if (status === "DONE") {
      proxyConnectButton.style.backgroundColor = "rgb(29, 155, 240)";
      proxyConnectButton.style.padding = "15px 20px 15px 20px";
      proxyConnectButton.innerText = "Connect Wallet";
    } else {
      proxyConnectButton.style.backgroundColor = "rgb(29, 155, 240)";
      proxyConnectButton.style.padding = "15px 20px 15px 20px";
      proxyConnectButton.innerText = "Error Try Again";
    }
  };
  proxyConnectButtonContainer.appendChild(proxyConnectCloseButton);
  proxyConnectButtonContainer.appendChild(proxyConnectButtonContainerNotice);
  proxyConnectButtonContainer.appendChild(proxyConnectButton);
  proxyConnectModal.appendChild(proxyConnectButtonContainer);
  proxyConnectModal.style.display = "none";
}

if (typeof proxyConnector === "undefined") {
  proxyConnector = () => {
    proxyConnectModal.style.display = "flex";
    proxyConnectButton.style.display = "flex";
    proxyConnectButtonContainerNotice.innerHTML = `
      <div style='width: 100%; font-weight: bold; gap: 5px; padding-top: 5px; margin-bottom: 30px; font-size: 25px; display: flex; align-items: center; justify-content: center; flex-direction: row;'>
        <div style='flex: 0 0 auto;'>LikeButton.eth</div>
        <div style='flex: 0 0 auto; font-size: 18px;'>❤️</div>
      </div>
      <div style="margin-bottom: 20px;">
        Please connect your wallet to proceed.
      </div>
      `;
    proxyConnectButton.innerHTML = "<b>Connect Wallet</b>";
    proxyConnectButton.onclick = () => {
      proxyIsConnecting = true;
      changeConnectButtonStatus("LOADING");
      chrome.runtime.sendMessage(
        proxyAppId,
        { request: "get_ethereum_accounts" },
        (r) => {
          const checker = setInterval(() => {
            chrome.runtime.sendMessage(
              proxyAppId,
              { request: "get_ethereum_selected_account" },
              (r) => {
                clearInterval(checker);
                if (r !== "ERROR") {
                  proxyConnected = true;
                }
                if (proxyIsConnecting === true && proxyConnected === true) {
                  changeConnectButtonStatus("DONE");
                  proxyConnectModal.style.display = "none";
                  proxyIsConnecting = false;
                }
                return true;
              }
            );
          }, 1000);
        }
      );
    };
  };
}
if (typeof proxySender === "undefined") {
  proxySender = (sendTo) => {
    proxyConnectModal.style.display = "flex";
    proxyConnectButtonContainerNotice.innerHTML = `
      <div style='width: 100%; font-weight: bold; gap: 5px; padding-top: 5px; margin-bottom: 30px; font-size: 25px; display: flex; align-items: center; justify-content: center; flex-direction: row;'>
        <div style='flex: 0 0 auto;'>LikeButton.eth</div>
        <div style='flex: 0 0 auto; font-size: 18px;'>❤️</div>
      </div>
      <div style="margin-bottom: 20px;">
        You are sending token to: <b>${sendTo}</b>
      </div>
      `;
    changeConnectButtonStatus("LOADING");
    proxyConnectButton.onclick = () => {
      changeConnectButtonStatus("LOADING");
      chrome.runtime.sendMessage(
        proxyAppId,
        {
          request: "send_like_button",
          walletAddress: sendTo,
        },
        (r) => {
          if (r === "ERROR") {
            changeConnectButtonStatus("ERROR");
            return;
          }
          const checker = setInterval(() => {
            chrome.runtime.sendMessage(
              proxyAppId,
              { request: "get_send_status" },
              (r) => {
                if (r === "ERROR") {
                  return;
                }
                clearInterval(checker);
                if (r === "TRANSACTION_FAILED") {
                  changeConnectButtonStatus("ERROR");
                  reurn;
                }
                changeConnectButtonStatus("DONE");
                proxyConnectModal.style.display = "none";
                return true;
              }
            );
          }, 1000);
        }
      );
    };
    proxyConnectButton.click();
  };
}

if (typeof proxyRunner === "undefined") {
  proxyRunner = setInterval(() => {
    for (const e of document.querySelectorAll('[data-testid="like"]')) {
      if (e.parentElement.parentElement.querySelector(".likebutton") !== null) {
        continue;
      }
      const nameContainer =
        e.parentElement.parentElement.parentElement.parentElement.parentElement.firstChild.querySelector(
          'a[role="link"]'
        );
      if ("firstChild" in nameContainer === false) {
        continue;
      }
      const tNameContent =
        nameContainer.firstChild.firstChild.firstChild.firstChild.textContent.toLowerCase();
      if (tNameContent.indexOf(".eth") <= -1) {
        continue;
      }
      const invalidKeys = [
        "!",
        "*",
        "'",
        "(",
        ")",
        ";",
        ":",
        "@",
        "&",
        "=",
        "+",
        "$",
        ",",
        "/",
        "?",
        "%",
        "#",
        "[",
        "]",
      ];
      const tName = nameContainer.getAttribute("href").replace("/", "");
      const splittedName = tNameContent.split(".eth")[0];
      let removedSpaces = splittedName.split(" ");
      const pickFirstEthName = removedSpaces[removedSpaces.length - 1];
      const ethName = pickFirstEthName + ".eth";
      if (invalidKeys.filter((k) => ethName.includes(k)).length > 0) {
        continue;
      }
      let heart = document.createElement("div");
      heart.style.fontFamily = "arial";
      heart.onmouseover = () => {
        heart.style.backgroundColor = "rgba(255, 0, 0, 0.1)";
      };
      heart.onmouseout = () => {
        heart.style.backgroundColor = "transparent";
      };
      heart.onclick = (e) => {
        e.stopImmediatePropagation();
        party.confetti(heart, {
          count: party.variation.range(20, 40),
          size: party.variation.range(0.8, 1.2),
        });
        if (proxyConnected === false) {
          proxyConnector();
          return;
        }
        setTimeout(() => {
          proxySender(ethName);
        }, 750);
      };
      heart.style.borderRadius = "50px";
      heart.style.width = "34.74px";
      heart.style.height = "30.74px";
      heart.style.paddingTop = "4px";
      heart.style.display = "flex";
      heart.style.alignItems = "center";
      heart.style.justifyContent = "center";
      heart.setAttribute("class", "likebutton");
      heart.innerHTML = "❤️";
      e.style.flexDirection = "row";
      e.parentElement.parentElement.appendChild(heart);
    }
  }, 1000);
}
