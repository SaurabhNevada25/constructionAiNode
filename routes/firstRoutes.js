import * as first_controller from "../controllers/firstController.js";

export function routes(router) {
    router.post("starting route to get the answer from the users question", "/startRoute", startRoute);
    return router;
}

async function startRoute(ctx, next) {
    const response = {};
    try {
        const body = ctx.request.body;
        if (!body?.question) {
            throw new Error("question is missing from payload");
        }
        const users_question = body.question;
        const resp = await first_controller.startRoute(users_question)
        response.status = { code: 200 };
        response.response = resp;
        ctx.body = response;
    } catch (err) {
        response.status = { code: 400 };
        response.error = err;
        ctx.body = response;
    }
}
