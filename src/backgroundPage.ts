import browser from "webextension-polyfill";

function injectedFunction_egrave() {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.value = "è";
    input.focus();
    input.select();
    document.execCommand("paste");
    input.remove();
    return input.value;
}
let out = "";

// Listen for messages sent from other parts of the extension
browser.runtime.onMessage.addListener(
    async (request: { popupMounted: boolean }) => {
        // Log statement if request.popupMounted is true
        // NOTE: this request is sent in `popup/component.tsx`
        if (request.popupMounted) {
            console.log("backgroundPage notified that Popup.tsx has mounted.");
        }
        const queryOptions = { active: true, currentWindow: true };

        const tab: any = await browser.tabs.query(queryOptions);
        console.log(tab, tab[0].id, "tab returned");
        // return;
        const resp = await (browser as any).scripting.executeScript({
            target: { tabId: tab[0].id },
            function: injectedFunction_egrave,
        });
        out = await resp;
        console.log(out, "resp");
        browser.runtime.sendMessage("oegedodocbbaghohhbbknikknllbkgei", {
            data: out,
            source: "event",
        });
        return { data: out, source: "returned from listener" };
    },
);

// Listen for hotkey shortcut command
browser.commands.onCommand.addListener((e_grave) => {
    // Callback to wait for chrome to get the current tab and then pass the tab into the injection script for copying to clipboard
    // getCurrentTab().then(function (tab: any) {
    //     console.log("hello");
    //     console.log(tab);
    //     (browser as any).scripting.executeScript({
    //         target: { tabId: tab.id },
    //         function: injectedFunction_egrave,
    //     });
    // });
    // getCurrentTab().then(async (tab: any) => {
    //     const resp = await (chrome as any).scripting.executeScript({
    //         target: { tabId: tab.id },
    //         function: injectedFunction_egrave,
    //     });
    //     out = await resp;
    //     console.log(out, "resp from initial run");
    //     setTimeout(() => {
    //         browser.runtime.sendMessage({ data: out, source: "key" });
    //     }, 1000);
    //     // setInterval(() => {
    //     //     browser.runtime.sendMessage({ data: out });
    //     // }, 1000);
    //     // window.alert("è copied to clipboard" + resp);
    // });
});
