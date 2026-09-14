import { defineConfig } from "orval";

export default defineConfig({
    api: {
        output: {
            mode: "tags-split",
            target: "src/api",
            schemas: {
                path: "src/api/model",
                splitByTags: true,
            },
            tsconfig: "./tsconfig.json",
            formatter: "prettier",
            client: "fetch",
            baseUrl: {
                runtime: "apiURL",
                imports: [{ name: "apiURL", importPath: "../env" }],
            },
            mock: true,
            override: {
                query: {
                    usePrefetch: true,
                },
                mutator: {
                    path: "src/api/fetchWithAuth.ts",
                    name: "fetchWithAuth",
                },
            },
            headers: true,
        },
        input: {
            target: "./macarte-api.yaml",
        },
    },
});
