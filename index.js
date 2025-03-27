"use strict";

import Koa from "koa";
import cors from "@koa/cors";
import Router from "koa-router";
import bodyParser from "koa-bodyparser";
import debug from "debug";
import fs from "fs";
import { join, dirname } from "path";
import { fileURLToPath, pathToFileURL } from "url";

const log = debug("server file log");

let server;
const app = new Koa();
let router = new Router();

app.use(async function healthCheck(ctx, next) {
    try {
        if (ctx.path === "/health_check") {
            ctx.body = { status: { code: 200 } };
        } else {
            await next();
        }
    } catch (err) {
        throw err;
    }
});

app.use(cors());
app.use(bodyParser());

async function startServer(port) {
    log(`Starting server on port ${port}`);

    // Get __dirname properly
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const routesPath = join(__dirname, "routes");
    
    fs.readdirSync(routesPath).forEach(async (file) => {
        try {
            const fullPath = pathToFileURL(join(routesPath, file)).href;
            const currentRoute = await import(fullPath);
            
            if (typeof currentRoute.default === "function") {
                router = currentRoute.default(router); // Assuming default export
            } else if (typeof currentRoute.routes === "function") {
                router = currentRoute.routes(router); // If exporting a function named routes
            }
        } catch (error) {
            console.error("Failed to load module:", error);
        }
    });

    app.use(router.routes()).use(router.allowedMethods());

    server = app.listen(port, () => {
        log(`Server started on port ${port}`);
    });
}

// Handle SIGINT (Ctrl+C)
process.on("SIGINT", async () => {
    if (server) server.close();
    log("Shutting down...");
    setTimeout(() => process.exit(0), 5000);
});

// Run server
(async () => {
    await startServer(3000);
})();
