import * as React from "react";
import * as ReactDOM from "react-dom";
import browser from "webextension-polyfill";
import { Popup } from "./component";
import "../css/app.css";

chrome.runtime.onMessage.addListener(async function (message: any) {
    if (message.data[0].result) {
        window.copyText = message.data[0].result;
    }
});

browser.tabs.query({ active: true, currentWindow: true }).then(() => {
    ReactDOM.render(<Popup />, document.getElementById("popup"));
});
