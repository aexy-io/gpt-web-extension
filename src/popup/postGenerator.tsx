// import { QueryHandler } from "@src/components/api";
import { getAllPublicTemplatesQuery } from "@src/components/api/queries/templates";
import * as React from "react";

import { useQuery } from "graphql-hooks";

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
        if (template) {
            const { metadata } = template;
            console.info("metadata", metadata);
            setVariables([...metadata?.variables]);
        }
    }, [template]);

    const [errorValues, setErrorValues] = React.useState({});
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
        console.log(index, event.target, data[index]);
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
                    console.info(e);

                    return (
                        <div key={index}>
                            <label
                                className="uppercase block tracking-wide text-grey-darker text-xs font-bold mx-3 mb-1"
                                id="grid-city"
                            >
                                {` ${index + 1}: ${placeholder}`}
                            </label>
                            <div
                                className="appearance-none w-full inline-block mx-3"
                                style={{
                                    width: "calc(30% - 8px)",
                                }}
                            >
                                <input
                                    className="appearance-none w-full bg-grey-lighter text-grey-darker border border-grey-lighter rounded py-3 px-4"
                                    id="grid-city"
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
                            // console.log("running prompt");
                            // await runPrompt();
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
        </div>
    );
};

const PostGenerator = () => {
    const [templates, setTemplates] = React.useState([]);

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
    return (
        <div>
            {templates.map((template: any, index: number) => {
                return (
                    <div className="px-1 my-1" key={index}>
                        {" "}
                        {template?.name}
                    </div>
                );
            })}
        </div>
    );
};

export default PostGenerator;
