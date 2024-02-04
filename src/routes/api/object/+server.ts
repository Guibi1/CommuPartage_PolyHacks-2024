import { deleteObject, getUser } from "$lib/db/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.object({
    id: z.string(),
});

export const DELETE: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) throw error(401);

    const data = schema.safeParse(await request.json());
    if (!data.success) throw error(400);
    const user = await getUser(session.user.email);

    return json({ success: await deleteObject(data.data.id, user?.email!) });
};
