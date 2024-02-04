import { getObjectsAndTransactionsOfUser, getUser } from "$lib/db/db.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, params }) => {
    const session = await locals.auth();
    if (!session?.user?.email) redirect(302, "/");

    const user = await getUser(session.user.email);
    if (!user) redirect(302, "/");

    const objects = await getObjectsAndTransactionsOfUser(user.id);

    return { user, objects: objects.toSorted((a, b) => (a.transaction ? 1 : -1)) };
};
