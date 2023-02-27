const modelNames = [
    {
        name: "text-chat-davinci-002",
        label: "Free Chat GPT Model",
        rating: 5,
    },
    {
        name: "text-davinci-001",
        label: "Latest Instruct Davinci GPT-3 model",
        rating: 4.5,
    },
    {
        name: "text-curie-001",
        label: "Latest Instruct Curie GPT-3 model",
        rating: 4,
    },
    {
        name: "text-babbage-001",
        label: "Latest Instruct Babbage GPT-3 model",
        rating: 3,
    },
    {
        name: "text-ada-001",
        label: "Latest Instruct Ada GPT-3 model",
        rating: 2,
    },
    { name: "davinci", label: "Base Davinci GPT-3 model", rating: 4.25 },
    { name: "curie", label: "Base Curie GPT-3 model", rating: 3.75 },
    { name: "babbage", label: "Base Babbage GPT-3 model", rating: 2.75 },
    { name: "ada", label: "Base Ada GPT-3 model", rating: 1.75 },
    {
        name: "code-davinci-001",
        label: "Codex Davinci GPT-3 model",
        rating: 4.5,
    },
    {
        name: "code-cushman-001",
        label: "Codex Cushman GPT-3 model",
        rating: 1.75,
    },
    {
        name: "text-similarity-ada-001",
        label: "Similarity embeddings Ada model",
        rating: 1.75,
    },
    {
        name: "text-similarity-babbage-001",
        label: "Similarity embeddings Babbage model",
        rating: 1.75,
    },
    {
        name: "text-similarity-curie-001",
        label: "Similarity embeddings Curie model",
        rating: 1.75,
    },
    {
        name: "text-similarity-davinci-001",
        label: "Similarity embeddings Davinci model",
        rating: 1.75,
    },
    {
        name: "text-search-ada-doc-001",
        label: "Text Document search embeddings models Ada model",
        rating: 1.75,
    },
    {
        name: "text-search-ada-query-001",
        label: "Text Query search embeddings models Ada model",
        rating: 1.75,
    },
    {
        name: "text-search-curie-doc-001",
        label: "Text Document search embeddings models Curie model",
        rating: 1.75,
    },
    {
        name: "text-search-curie-query-001",
        label: "Text Query search embeddings models Curie model",
        rating: 1.75,
    },
    {
        name: "text-search-babbage-doc-001",
        label: "Text Document search embeddings models Babbage model",
        rating: 1.75,
    },
    {
        name: "text-search-babbage-query-001",
        label: "Text Query search embeddings models Babbage model",
        rating: 1.75,
    },
    {
        name: "code-search-ada-code-001",
        label: "Code search embeddings Ada GPT-3 model",
        rating: 4.25,
    },
    {
        name: "code-search-ada-text-001",
        label: "Text search embeddings Ada GPT-3 model",
        rating: 3.75,
    },
    {
        name: "code-search-babbage-code-001",
        label: "Code search embeddings Ada GPT-3 model",
        rating: 4.25,
    },
    {
        name: "code-search-babbage-text-001",
        label: "Text search embeddings Ada GPT-3 model",
        rating: 3.75,
    },
    {
        name: "content-filter-alpha",
        label: "Content Filter GPT Model",
        rating: 2.75,
    },
];

const gptInputs = [
    {
        name: "openAIOrg",
        label: "Your Open AI Org ID",
        type: "string",
        required: true,
        error: "Org ID is required",
        message: "",
        description:
            "A unique identifier representing your end-user, which will help OpenAI to monitor and detect abuse. [Find your Org Id here](https://platform.openai.com/account/org-settings)",
        placeholder: "EX:",
    },
    {
        name: "openAIKey",
        label: "Your Open AI API Key",
        type: "string",
        required: true,
        error: "API Key is required",
        message: "",
        description:
            "A unique api key representing your end-user [Learn more](/docs/usage-policies/end-user-ids)",
        placeholder: "EX:",
    },
    {
        name: "suffix",
        label: "Suffix",
        min: 0,
        max: 1,
        type: "string",
        step: 0.1,
        message: "Please select a model",
        description:
            "The suffix that comes after a completion of inserted text.",
        placeholder: "EX: suffix you want added after the prompt.",
    },
    {
        name: "max_tokens",
        label: "Maximum no. of tokens",
        min: 0,
        max: 2048, //4096 for the new model
        type: "number",
        step: 1,
        message:
            "Please select the maximum no. of tokens you want to generate in the prompt",
        description:
            "The maximum number of [tokens](/tokenizer) to generate in the completion.  The token count of your prompt plus `max_tokens` cannot exceed the model's context length. Most models have a context length of 2048 tokens (except for the newest models, which support 4096).",
        value: 400,
    },

    {
        name: "n",
        label: "No. of prompts to generate",
        min: 1,
        max: 10, //4096 for the new model
        type: "number",
        step: 1,
        message: "",
        description:
            "How many completions to generate for each prompt.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.",
        value: 1,
    },

    {
        name: "logprobs",
        label: "Include the log proabilities of the tokens",
        min: 0,
        max: 5,
        type: "number",
        step: 1,
        message: "",
        description:
            "Include the log probabilities on the `logprobs` most likely tokens, as well the chosen tokens. For example, if `logprobs` is 5, the API will return a list of the 5 most likely tokens. The API will always return the `logprob` of the sampled token, so there may be up to `logprobs+1` elements in the response.  The maximum value for `logprobs` is 5. If you need more than this, please contact us through our [Help center](https://help.openai.com) and describe your use case.",
        value: 1,
    },
    {
        name: "echo",
        label: "Whether to echo the prompt",
        type: "boolean",
        message: "",
        description: "Echo back the prompt in addition to the completion",
        value: false,
    },
    {
        name: "frequency_penalty",
        label: "Frequency Penalty",
        min: 0,
        max: 10, //4096 for the new model
        type: "number",
        step: 1,
        message: "",
        description:
            "Number between -2.0 and 2.0. Positive values penalize new tokens based on their existing frequency in the text so far, decreasing the model's likelihood to repeat the same line verbatim.  [See more information about frequency and presence penalties.](/docs/api-reference/parameter-details)",
        value: 1,
    },
    {
        name: "best_of",
        label: "Generate better texts{TODO}",
        min: 0,
        max: 10, //4096 for the new model
        type: "number",
        step: 1,
        message: "",
        description:
            'Generates `best_of` completions server-side and returns the "best" (the one with the highest log probability per token). Results cannot be streamed.  When used with `n`, `best_of` controls the number of candidate completions and `n` specifies how many to return – `best_of` must be greater than `n`.  **Note:** Because this parameter generates many completions, it can quickly consume your token quota. Use carefully and ensure that you have reasonable settings for `max_tokens` and `stop`.',
        value: 1,
    },

    {
        name: "temperature",
        label: "Temperature",
        min: 0,
        max: 1, //4096 for the new model
        type: "number",
        step: 0.1,
        message: "",
        description:
            "What [sampling temperature](https://towardsdatascience.com/how-to-sample-from-language-models-682bceb97277) to use. Higher values means the model will take more risks. Try 0.9 for more creative applications, and 0 (argmax sampling) for ones with a well-defined answer.  We generally recommend altering this or `top_p` but not both.",
        value: 0.1,
    },
];

export { modelNames, gptInputs };
