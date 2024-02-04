import { error, json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.object({});

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session) throw error(401);

    const data = schema.safeParse(await request.json());
    if (!data.success) throw error(400);

    return json({ success: true });
};
