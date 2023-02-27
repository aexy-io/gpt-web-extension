// import { QueryHandler } from "@src/components/api";
import {
    getAllPublicTemplatesQuery,
    runCustomPrompt,
    runPrompt,
    validateSettings,
} from "@src/components/api/queries/templates";
import * as React from "react";

import { useQuery } from "graphql-hooks";
import Browser from "webextension-polyfill";
import { useRef, useState } from "react";

const getErrorStyle = (name: string, errorValues: any) => {
    return errorValues && errorValues[name] ? { borderColor: "red" } : null;
};

const getErrorMsg = (name: string, errorValues: any, error?: string) => {
    return errorValues && errorValues[name] ? (
        <span className="text-grey-dark text-xs italic text-red-500">
            * {error ?? errorValues[name]}
        </span>
    ) : null;
};

const CustomTemplate = () => {
    const [errorValues, setErrorValues] = useState({});
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const [result, setResult] = useState("The result will appear here");
    const [inputData, setInputData] = useState<{ [key: string]: string }>({});

    const validateForm = () => {
        const errors: any = {};
        setErrorValues(errors);

        if (!Object.keys(errors).length) {
            return true;
        }
        setErrorValues(errors);
        return false;
    };

    React.useEffect(() => {
        setTimeout(async () => {
            const chatgptPrompt = `You are GPT-3. Today is October 16, 2022. Answer the following questions. ‘
            If you can answer directly, use this format:
            
            Question: \${Question}
            Answer: \${Answer}
            
            You are unable to directly answer any question that requires:
            - Analyzing text as a sequence of characters (e.g., counting length, reversing strings)
            - Counting of more than several items (e.g., words in a sentence or items in a list)
            - Arithmetic that a human could not perform easily in their head
            
            In these cases, consult IPython. Use this format:
            
            Question: \${Question}
            IPython session:
            
            \${IPython commands and output needed to find answer}
            Answer: S{Answer}
            
            Your training data was last updated April 2021, and you do not know any later events. Consult Wikipedia
            using the ‘wikipedia’ package for any question whose answer may have changed since then.
            
            Begin.`;
            setInputData({
                ...inputData,
                ...{ supplimentaryInstruction: chatgptPrompt },
            });
        }, 300);
    }, []);

    const handleFormChange = (index: string, event: any) => {
        setInputData({ ...inputData, ...{ [index]: event.target.value } });
    };
    return (
        <div>
            <div className="w-full px-3 mb-6 md:mb-0 h-22 mt-5 ">
                <div>
                    <div className="mb-3 px-2 ">
                        <label className="form-label inline-block mb-2 text-gray-700">
                            Ask ChatGPT:
                        </label>
                        <textarea
                            ref={inputRef}
                            className="form-control block w-full py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none "
                            rows={3}
                            id="copiedArea"
                            placeholder=""
                            value={inputData["instruction"]}
                            onChange={(event) => {
                                handleFormChange("instruction", event);
                            }}
                        ></textarea>
                    </div>
                </div>
            </div>
            <div className="w-full px-3 mb-6 md:mb-0 h-22 mt-5 ">
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 mx-3 rounded"
                    onClick={async (e) => {
                        e.preventDefault();
                        if (validateForm()) {
                            if (inputData["instruction"] === "") {
                                return await Browser.notifications.create({
                                    type: "basic",
                                    iconUrl: "favicon-16x16.png",
                                    title: "Missing Input",
                                    message: "Kindly Fill All Fields",
                                });
                            }
                            const result = await runCustomPrompt(inputData);
                            if (result?.error) {
                                console.log(result?.error);
                                return await Browser.notifications.create({
                                    type: "basic",
                                    iconUrl: "favicon-16x16.png",
                                    title: "Error Running Prompt",
                                    message: result?.error,
                                });
                            } else {
                                setResult(result?.data);
                            }
                        }
                    }}
                >
                    Get Answer
                </button>
            </div>
            {/* {promptError ? (
                <div {...tailFormItemLayout} className="w-full mt-5 mx-5">
                    <Alert
                        type="error"
                        message={`Running Prompt failed`}
                        description={<span>{promptError}</span>}
                    />
                </div>
            ) : null} */}
            {result && (
                <div
                    className=" mx-3 p-1 bg-white rounded-md text-md"
                    onClick={() => {
                        navigator.clipboard.writeText(result).then(
                            () => {
                                Browser.notifications.create({
                                    type: "basic",
                                    iconUrl: "favicon-16x16.png",
                                    title: "Copied Successfully",
                                    message:
                                        "Text copied to clipboard successfully",
                                });
                            },
                            () => {
                                Browser.notifications.create({
                                    type: "basic",
                                    iconUrl: "favicon-16x16.png",
                                    title: "Copy Failed",
                                    message: "Text copying to clipboard failed",
                                });
                                /* clipboard write failed */
                            },
                        );
                    }}
                >
                    {result}
                </div>
            )}
        </div>
    );
};

export default CustomTemplate;
