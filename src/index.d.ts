// express

declare namespace Express {
    export interface Request {
        isAuth: boolean;
        userId?: string;
        email?: string;
        validated: {
            body: Record<string, any>;
            params: Record<string, any>;
        };
    }
}

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
        JWT_SECRET: string;
        CHANGE_PASSWORD_SECRET: string;
    }
}