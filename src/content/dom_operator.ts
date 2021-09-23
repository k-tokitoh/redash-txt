import { CopyOutlined } from "@ant-design/icons-svg";
import { renderIconDefinitionToSVGElement } from "@ant-design/icons-svg/es/helpers";
import { format } from "./formatter";

export const addCopyButton = () => {
  const queryExecutionMetadataElement = getQueryExecutionMetadataElement();
  if (!queryExecutionMetadataElement) return;

  const span = document.createElement("span");
  span.setAttribute("class", "m-r-5");
  queryExecutionMetadataElement.firstElementChild?.insertAdjacentElement(
    "afterend",
    span
  );

  const button = document.createElement("button");
  button.setAttribute("class", "ant-btn");
  button.onclick = async () => {
    const result = await copy();
    const message = !!result ? "copy completed!" : "failed to copy.";
    alert(message);
  };
  span.append(button);

  button.insertAdjacentHTML("afterbegin", copyIconHtml);

  return button;
};

const copyIconHtml = renderIconDefinitionToSVGElement(CopyOutlined, {
  extraSVGAttrs: { width: "1em", height: "1em", fill: "currentColor" },
});

const copy = async () => {
  const text = await getFormattedText();
  if (!text) return;
  await navigator.clipboard.writeText(text);
  return text;
};

const getFormattedText = async () => {
  const href = getCsvHref();
  if (!href) return;
  const res = await fetch(href);
  const blob = await res.blob();
  const text = await blob.text();
  return format(text);
};

const getCsvHref = () => {
  const dropdown = getDropdown();
  if (!dropdown) return;
  const href = dropdown
    .getElementsByTagName("ul")[0]
    ?.firstElementChild?.getElementsByTagName("a")[0]
    ?.getAttribute("href");
  if (!href) throw "csv href cannot be specified.";
  return href;
};

const getDropdown = () => {
  const dropdownButton = getDropdownButton();
  if (!dropdownButton) return;
  Array(2)
    .fill(null)
    .forEach(() => dropdownButton.click());
  const elem = document.getElementsByClassName(
    "query-control-dropdown-overlay"
  )[0];
  if (!elem) throw "dropdown not found.";
  return elem;
};

const getDropdownButton = () => {
  const queryExecutionMetadataElement = getQueryExecutionMetadataElement();
  if (!queryExecutionMetadataElement) return;
  const dropdownButton =
    queryExecutionMetadataElement.getElementsByTagName("button")[0];
  if (!dropdownButton) throw "dropdown button not found.";
  return dropdownButton;
};

type GetQueryExecutionMetadataElement = () => Element | undefined;
const getQueryExecutionMetadataElement: GetQueryExecutionMetadataElement = () =>
  document.getElementsByClassName("query-execution-metadata")[0];
