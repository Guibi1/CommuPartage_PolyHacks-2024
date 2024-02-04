import { setUserPosition } from "$lib/db/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.object({
    lat: z.number(),
    lng: z.number(),
});

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) throw error(401);
    const j = await request.json();

    const data = schema.safeParse(j);
    if (!data.success) throw error(400);

    return json({
        success: await setUserPosition(session.user.email, data.data),
    });
};
