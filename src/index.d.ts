// nodejs
declare namespace NodeJS {
    // Merge the existing `ProcessEnv` definition with ours
    // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
    export interface ProcessEnv {
        NODE_ENV: "development" | "production" | "test";
        PG_USER: string;
        PG_PASSWORD: string;
        PG_DB: string;
        PG_HOST: string;
        PG_PORT: string;
        RESET_PASSWORD_SECRET: string;

        OAUTH_CLIENT_ID: string;
        OAUTH_USER: string;
        OAUTH_CLIENT_SECRET: string;
        OAUTH_ACCESS_TOKEN: string;
        OAUTH_REFRESH_TOKEN: string;

        NOREPLY_EMAIL: string;
    }
}