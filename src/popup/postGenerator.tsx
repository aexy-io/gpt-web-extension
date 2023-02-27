// import { QueryHandler } from "@src/components/api";
import {
    getAllPublicTemplatesQuery,
    runPrompt,
    validateSettings,
} from "@src/components/api/queries/templates";
import * as React from "react";

import { useQuery } from "graphql-hooks";
import Browser from "webextension-polyfill";
import { gptInputs, modelNames } from "@src/components/api/misc";
import ReactSlider from "react-slider";

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

const RunTemplate = (template: any) => {
    const [variables, setVariables] = React.useState<
        {
            name: string | undefined;
            placeholder: string | undefined;
            value: string | undefined;
            examples: string | undefined;
        }[]
    >([]);

    React.useEffect(() => {
        if (template?.template?.metadata?.variables) {
            setVariables(template?.template?.metadata?.variables);
        }
    }, [template?.metadata?.variables]);

    const [errorValues, setErrorValues] = React.useState({});
    const [result, setResult] = React.useState("The result will appear here");
    const validateForm = () => {
        const errors: any = {};
        setErrorValues(errors);
        for (const index in variables) {
            const { value } = variables[index];
            if (!value) errors[`variables${index}`] = "Error";
        }
        if (!Object.keys(errors).length) {
            return true;
        }
        setErrorValues(errors);
        return false;
    };

    const handleFormChange = (index: any, event: any) => {
        const data = [...variables];
        if (event.target.value) {
            const errors: any = { ...errorValues };
            delete errors[`variables${index}`];
        }
        data[index] = { ...data[index], value: event.target.value };
        setVariables(data);
    };
    return (
        <div>
            <div className="w-full px-3 mb-6 md:mb-0 h-22 mt-5 ">
                {variables.map((e, index) => {
                    const { placeholder, examples } = e;
                    return (
                        <div key={index}>
                            <label className="uppercase block tracking-wide text-grey-darker text-xs font-bold mx-3 mb-1">
                                {` ${index + 1}: ${placeholder}`}
                            </label>
                            <div
                                className="appearance-none w-full inline-block mx-3"
                                style={{
                                    width: "90%",
                                }}
                            >
                                <input
                                    className="appearance-none w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                                    type="text"
                                    name="value"
                                    // style={getErrorStyle(
                                    //     `variables${index}`,
                                    //     errorValues,
                                    // )}
                                    placeholder="Value"
                                    onChange={(event) =>
                                        handleFormChange(index, event)
                                    }
                                />
                                {getErrorMsg(
                                    `variables${index}`,
                                    errorValues,
                                    "A value is required",
                                )}
                            </div>
                            <p className="text-grey-dark text-xs italic mt-1 mb-4 mx-3">
                                {`Examples: ${examples}`}
                            </p>
                        </div>
                    );
                })}
            </div>
            <div className="w-full px-3 mb-6 md:mb-0 h-22 mt-5 ">
                <button
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-4 mx-3 rounded"
                    onClick={async (e) => {
                        e.preventDefault();
                        if (validateForm()) {
                            console.log("running prompt");
                            const { error, fields, keys } =
                                await validateSettings();
                            if (error) {
                                return await Browser.notifications.create({
                                    type: "basic",
                                    iconUrl: "favicon-16x16.png",
                                    title: "Missing Settings",
                                    message: error,
                                });
                            }
                            const result = await runPrompt(
                                variables,
                                template?.template?.id,
                                keys,
                            );
                            if (result?.error) {
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
                    Run Prompt
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
                    className="w-full px-1 bg-white rounded-md text-md"
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

export const SettingsTab = () => {
    const [errorValues, setErrorValues] = React.useState({});
    const [settingValues, setSettingValues] = React.useState<{
        [key: string]: any;
    }>({});

    const getSettingValues = async () => {
        const bromoKey = await Browser.storage.local.get("bromoKey");
        const openAIKey = await Browser.storage.local.get("openAIKey");
        const openAIOrg = await Browser.storage.local.get("openAIOrg");
        const settings = {
            bromoKey: bromoKey?.bromoKey,
            openAIKey: openAIKey?.openAIKey,
            openAIOrg: openAIOrg?.openAIOrg,
        };
        setSettingValues(settings);
    };

    React.useEffect(() => {
        getSettingValues();
    }, []);

    const handleFormChange = (name: string, event: any) => {
        console.log(name, event);
        if (name === "modelName") {
            const errors: any = { ...errorValues };
            delete errors[name];
            setSettingValues(
                Object.assign({}, settingValues, {
                    [name]: event,
                }),
            );
            Browser.storage.local.set({ [name]: event });
        }
        if (event?.target?.value) {
            const errors: any = { ...errorValues };
            delete errors[name];
            setSettingValues(
                Object.assign({}, settingValues, {
                    [name]: event.target.value,
                }),
            );
            Browser.storage.local.set({ [name]: event.target.value });
        }
    };

    return (
        <div>
            <div className="w-full px-3 mb-6 md:mb-0 h-22 mt-5 ">
                <div>
                    <label className="uppercase block tracking-wide text-grey-darker text-xs font-bold mb-1">
                        Choose AI Model
                    </label>
                    <select
                        className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded  mb-4"
                        onChange={(e) => {
                            handleFormChange("modelName", e.target.value);
                        }}
                    >
                        {modelNames.map((model) => {
                            return (
                                <option key={model.name} value={model.name}>
                                    {model.label}
                                </option>
                            );
                        })}
                    </select>{" "}
                </div>
                <div>
                    <label className="uppercase block tracking-wide text-grey-darker text-xs font-bold mb-1">
                        Bromo API Key
                    </label>
                    <div
                        className="appearance-none w-full inline-block"
                        style={{
                            width: "100%",
                        }}
                    >
                        <input
                            className="appearance-none w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                            type="text"
                            name="bromoKey"
                            // style={getErrorStyle(
                            //     `variables${index}`,
                            //     errorValues,
                            // )}
                            value={settingValues?.bromoKey || ""}
                            placeholder="Value"
                            onChange={(event) =>
                                handleFormChange("bromoKey", event)
                            }
                        />
                        {getErrorMsg(
                            `bromoKey`,
                            errorValues,
                            "A value is required",
                        )}
                    </div>
                    <p className="text-grey-dark text-xs italic mt-1 mb-4 mx-3">
                        {`OR`}
                    </p>
                </div>
            </div>

            {gptInputs.map((input) => {
                switch (input.type) {
                    case "string":
                        return (
                            <div className="md:w-1/2 px-3 mb-6 md:mb-0 h-22 mt-5 ">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                    htmlFor="grid-city"
                                >
                                    {input.label}
                                </label>
                                <input
                                    className="appearance-none block w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                                    id="grid-city"
                                    type="text"
                                    name={input.name}
                                    placeholder={input.placeholder}
                                    value={settingValues[input.name]}
                                    // style={
                                    //     (input?.required &&
                                    //         getErrorStyle(
                                    //             input.name,
                                    //             errorValues,
                                    //         )) ||
                                    //     ""
                                    // }
                                    onChange={(e) => {
                                        handleFormChange(
                                            input.name,
                                            e.target.value,
                                        );
                                    }}
                                />
                                {input.required &&
                                    getErrorMsg(
                                        input.name,
                                        errorValues,
                                        input.error,
                                    )}
                                <p className="text-grey-dark text-xs italic my-1 py-2">
                                    {input.description}
                                </p>
                            </div>
                        );
                    case "number":
                        return (
                            <div className="md:w-1/2 px-3 mt-5 h-22">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                    htmlFor="grid-zip"
                                >
                                    {input.label}
                                </label>
                                <div className="pt-3">
                                    <ReactSlider
                                        className="horizontal-slider"
                                        thumbClassName="slider-thumb"
                                        trackClassName="slider-track"
                                        min={input.min}
                                        max={input.max}
                                        step={input.step}
                                        value={settingValues[input.name]}
                                        onChange={(e: any) => {
                                            handleFormChange(input.name, e);
                                        }}
                                        renderThumb={(
                                            props: any,
                                            state: any,
                                        ) => (
                                            <div {...props}>{state.value}</div>
                                        )}
                                    />
                                    <p className="text-grey-dark text-xs italic my-5 py-5">
                                        {input.description}
                                    </p>
                                </div>
                            </div>
                        );

                    case "boolean":
                        return (
                            <div className="md:w-1/2 px-3 h-22  mt-5 ">
                                <label
                                    className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
                                    htmlFor="grid-state"
                                >
                                    {input.label}
                                </label>
                                <div className="relative">
                                    <select
                                        className="block appearance-none w-full bg-grey-lighter border border-grey-lighter text-grey-darker py-3 px-4 pr-8 rounded"
                                        id="grid-state"
                                        value={settingValues[input.name]}
                                        onChange={(e) => {
                                            handleFormChange(
                                                input.name,
                                                e.target.value,
                                            );
                                        }}
                                    >
                                        <option value={"true"}>True</option>
                                        <option value={"false"}>False</option>
                                    </select>
                                    <div className="pointer-events-none absolute pin-y pin-r flex items-center px-2 text-grey-darker">
                                        <svg
                                            className="h-4 w-4"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                        </svg>
                                    </div>
                                    <p className="text-grey-dark text-xs italic">
                                        {input.description}
                                    </p>
                                </div>
                            </div>
                        );

                    default:
                        break;
                }
            })}
        </div>
    );
};

const PostGenerator = () => {
    const [templates, setTemplates] = React.useState([]);
    const [selectedTemplate, setSelectedTemplate] = React.useState(null);

    const setValues = React.useMemo(() => {
        templates.filter((temp) => {
            try {
                delete temp["metadata"]["promptTemplate"];
            } catch (e) {}
            return temp;
        });
        return;
    }, [templates]);

    const { loading, error, data } = useQuery(getAllPublicTemplatesQuery, {
        variables: {},
    });
    console.log(loading, error, data);

    React.useEffect(() => {
        // fetchData();
        if (data?.templates?.nodes) {
            setTemplates(data?.templates?.nodes);
        }
    }, [data]);
    if (loading) {
        return <div>Landing....</div>;
    }
    console.log(selectedTemplate);
    if (selectedTemplate) {
        return <RunTemplate template={selectedTemplate} />;
    }

    return (
        <div>
            {templates.map((template: any, index: number) => {
                return (
                    <div
                        className="flex items-center p-4 m-1 text-white bg-blue-500 shadow-xs cursor-pointer hover:bg-blue-600"
                        key={index}
                        onClick={() => setSelectedTemplate(template)}
                    >
                        {template?.name}
                    </div>
                );
            })}
        </div>
    );
};

export default PostGenerator;
