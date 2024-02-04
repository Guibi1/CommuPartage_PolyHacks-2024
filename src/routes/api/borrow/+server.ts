import { getUser, insertTransaction } from "$lib/db/db";
import { error, json, type RequestHandler } from "@sveltejs/kit";
import { z } from "zod";

const schema = z.object({
    object_id: z.string(),
    lender_id: z.string(),
});

export const POST: RequestHandler = async ({ request, locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) throw error(401);
    const user = await getUser(session.user.email);
    const j = await request.json();
    console.log("🚀 ~ constPOST:RequestHandler= ~  j:", j);

    const data = schema.safeParse(j);
    if (!data.success) throw error(400);

    return json({
        success: await insertTransaction({
            ...data.data,
            receiver_id: user?.id!,
            date_start: new Date(),
            active: false,
        }),
    });
};
