import { addCopyButton } from "./dom_operator";

const observer = new MutationObserver(() => {
  const copyButton = addCopyButton();
  if (!copyButton) return;
  disconnect();
});

const disconnect = () => {
  observer.disconnect();
};

const main = () => {
  observer.observe(document, {
    subtree: true,
    childList: true,
  });
};

main();
