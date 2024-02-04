import { deleteObject, getUser, insertObject } from "$lib/db/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

const postPchema = z.object({
    id: z.string(),
    name: z.string().min(2).max(50),
    value: z.coerce.number().min(0).max(300),
});

const schema = z.object({
    id: z.string(),
});

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) throw error(401);
    const j = await request.json();

    const data = postPchema.safeParse(j);
    if (!data.success) throw error(400);
    const user = await getUser(session.user.email);

    return json({ success: await insertObject({ ...data.data, owner_id: user?.id! }) });
};

export const DELETE: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) throw error(401);
    const j = await request.json();

    const data = schema.safeParse(j);
    if (!data.success) throw error(400);
    const user = await getUser(session.user.email);

    return json({ success: await deleteObject(data.data.id, user?.id!) });
};
