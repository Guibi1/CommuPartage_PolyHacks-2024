import { setUserPosition } from "$lib/db/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.object({
    latitude: z.number(),
    longitude: z.number(),
});

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) throw error(401);

    const data = schema.safeParse(await request.json());
    if (!data.success) throw error(400);

    return json({
        success: await setUserPosition(session.user.email, {
            lat: data.data.latitude,
            lng: data.data.longitude,
        }),
    });
};
