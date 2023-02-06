import React, { useState } from "react";
import browser, { Tabs } from "webextension-polyfill";
import css from "./styles.module.css";
import PostGenerator, { SettingsTab } from "./postGenerator";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { baseURL } from "@src/components/api/queries/templates";
import Browser from "webextension-polyfill";

function scrollWindow(position: number) {
    window.scroll(0, position);
}

/**
 * Executes a string of Javascript on the current tab
 * @param code The string of code to execute on the current tab
 */
function executeScript(position: number): void {
    // Query for the active tab in the current window
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs: Tabs.Tab[]) => {
            // Pulls current tab from browser.tabs.query response
            const currentTab: Tabs.Tab | number = tabs[0];

            // Short circuits function execution is current tab isn't found
            if (!currentTab) {
                return;
            }
            const currentTabId: number = currentTab.id as number;

            // Executes the script in the current tab
            browser.scripting
                .executeScript({
                    target: {
                        tabId: currentTabId,
                    },
                    func: scrollWindow,
                    args: [position],
                })
                .then(() => {
                    console.log("Done Scrolling");
                });
        });
}

const popularTab = () => {
    return (
        <div>
            {" "}
            <div className="mb-6">
                <ul>
                    <li className="mb-4">
                        <div className="flex items-center p-4 text-white bg-blue-500 rounded-xl">
                            <a
                                href="/popup/postGenerator"
                                // component={PostGenerator}
                                // onClick={(e) => {
                                //     e.preventDefault();
                                //     console.log("print");
                                // }}
                            >
                                <span className="ml-4 text-sm font-semibold">
                                    Viral Post Generator
                                </span>
                            </a>
                        </div>
                    </li>

                    <li className="mb-4">
                        <a
                            className="flex items-center p-4 text-white bg-blue-500 rounded-xl"
                            href="#"
                        >
                            <span className="ml-4 text-sm font-semibold">
                                Jira Generator
                            </span>
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    );
};

const client = new GraphQLClient({
    url: `${baseURL}/graphql`,
});

client.setHeader("client", "api");

export function Popup() {
    // Sends the `popupMounted` event
    const setClientHeader = async () => {
        const bromoKey = await Browser.storage.local.get("bromoKey");
        if (bromoKey?.bromoKey) {
            client.setHeader("Authorization", `Bearer ${bromoKey.bromoKey}`);
        }
    };
    React.useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
        setClientHeader();
    }, []);
    const [tabState, setTabState] = useState(0);
    // Renders the component tree
    return (
        <ClientContext.Provider value={client}>
            <div className={css.popupContainer}>
                <div className="container h-full">
                    <div className="bg-white mb-2">
                        <nav className="flex flex-row pl-2">
                            <button
                                className={` py-4 px-6 block hover:text-blue-500 focus:outline-none ${
                                    tabState === 0
                                        ? "text-blue-500 border-b-2 font-medium border-blue-500"
                                        : "text-gray-600"
                                }`}
                                onClick={() => {
                                    setTabState(0);
                                }}
                            >
                                Popular
                            </button>
                            <button
                                className={` py-4 px-6 block hover:text-blue-500 focus:outline-none ${
                                    tabState === 1
                                        ? "text-blue-500 border-b-2 font-medium border-blue-500"
                                        : "text-gray-600"
                                }`}
                                onClick={() => {
                                    setTabState(1);
                                }}
                            >
                                Settings
                            </button>
                        </nav>
                    </div>
                    {tabState === 0 && <PostGenerator />}
                    {tabState === 1 && <SettingsTab />}
                </div>
                {/* <div className="mx-4 my-4">
                <Hello />
                <hr />
                <Scroller
                    onClickScrollTop={() => {
                        executeScript(scrollToTopPosition);
                    }}
                    onClickScrollBottom={() => {
                        executeScript(scrollToBottomPosition);
                    }}
                />
            </div> */}
            </div>
        </ClientContext.Provider>
    );
}
