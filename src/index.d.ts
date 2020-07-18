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
        CHANGE_PASSWORD_SECRET: string;
    }
}