import Browser from "webextension-polyfill";

export const baseURL = "https://bromo.app";

const getAllPublicTemplatesQuery = `
query GetAllPublicTemplates {
    templates(condition: { public: true }) {
      nodes {
        id
        name
        metadata
        public
        tags
        updatedAt
        websites
        createdAt
        userByUid {
          id
          username
          name
        }
      }
    }
  }
`;

const validateSettings = async () => {
    const bromoKey = await Browser.storage.local.get("bromoKey");
    const openAIKey = await Browser.storage.local.get("openAIKey");
    const openAIOrg = await Browser.storage.local.get("openAIOrg");
    console.log(bromoKey, openAIKey, openAIOrg, "value from settings");

    if (!bromoKey?.bromoKey && !openAIKey?.openAIKey && !openAIOrg?.openAIOrg) {
        return {
            error: "No keys are passed",
            fields: ["bromoKey", "openAIKey", "openAIOrg"],
        };
    }

    if (openAIKey?.openAIKey && !openAIOrg?.openAIOrg) {
        return {
            error: "Open AI Org is missing",
            fields: ["openAIOrg"],
        };
    }
    return {
        error: null,
        fields: null,
        keys: {
            bromoKey: bromoKey?.bromoKey,
            openAIKey: openAIKey?.openAIKey,
            openAIOrg: openAIOrg?.openAIOrg,
        },
    };
};

const runPrompt = (variables: any, templateId: string, keys: any) => {
    return fetch(`${baseURL}/webhook/v1/extension`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            variables,
            templateId,
            ...keys,
            type: "openai",
        }),
    })
        .then((res) => res.json())
        .then((res) => {
            return { data: res.data, error: res.error };
        })
        .catch((err) => {
            return { error: err, data: null };
        });
};

export { getAllPublicTemplatesQuery, runPrompt, validateSettings };
