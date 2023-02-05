import React, { useState } from "react";
import { Hello } from "@src/components/hello";
import browser, { Tabs } from "webextension-polyfill";
import { Route } from "react-router-dom";
import { Scroller } from "@src/components/scroller";
import css from "./styles.module.css";
import PostGenerator from "./postGenerator";

// // // //

// Scripts to execute in current tab
const scrollToTopPosition = 0;
const scrollToBottomPosition = 9999999;

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

const baseURL = "http://localhost:5678";

export function Popup() {
    // Sends the `popupMounted` event
    React.useEffect(() => {
        browser.runtime.sendMessage({ popupMounted: true });
    }, []);
    const [tabState, setTabState] = useState(0);
    // Renders the component tree
    return (
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
                            Recommended
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
                            Popular
                        </button>
                        <button
                            className={` py-4 px-6 block hover:text-blue-500 focus:outline-none ${
                                tabState === 2
                                    ? "text-blue-500 border-b-2 font-medium border-blue-500"
                                    : "text-gray-600"
                            }`}
                            onClick={() => {
                                setTabState(2);
                            }}
                        >
                            Saved
                        </button>
                    </nav>
                </div>
                {tabState === 0 && popularTab()}
                {tabState === 1 && <span>tab 1</span>}
                {tabState === 2 && <span>tab 2</span>}
                {tabState === 3 && <span>tab 3</span>}
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
    );
}
