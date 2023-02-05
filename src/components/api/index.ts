import { GraphQLClient, useQuery } from "graphql-hooks";

// const jwt = require("jsonwebtoken");

const url = "http://localhost:5678/graphiql";

const client = new GraphQLClient({ url });

// const secret =
//     "XnBiieIAt6DMa3q9l_tIi9WftxuERCejXgyLfj0j7-10ICcc8XrIjtsvzL9ibS5Q";

const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJwb3N0Z3JhcGhxbCIsInJvbGUiOiJhZXh5X3Zpc2l0b3IiLCJpZCI6IjMyZWFjNTE1LTU0YmItNGE0NC05YWFjLTExZjU1MTliZTViNiIsImlhdCI6MTY3NTUzMTUxN30.6bdx46cbzSWD1uLjWPOzh0Uaz3O8JeENkWYO2s4RFRw";
client.setHeaders({
    Authorization: `Bearer ${token}`,
    client: "api",
});

const useQueryHandler = (query: string, data: any) => {
    return useQuery(query, {
        client,
        variables: data,
    });
};

export { useQueryHandler };
