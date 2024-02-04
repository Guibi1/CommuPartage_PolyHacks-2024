import { insertReview } from "$lib/db/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.object({
    user_id: z.string(),
    writer_id: z.string(),
    description: z.string(),
    rating: z.number(),
});

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) throw error(401);
    const j = await request.json();

    const data = schema.safeParse(j);
    if (!data.success) throw error(400);

    const t = await insertReview(data.data);
    console.log("🚀 ~ constPOST:RequestHandler= ~ t:", t);
    return json({
        success: t,
    });
};
