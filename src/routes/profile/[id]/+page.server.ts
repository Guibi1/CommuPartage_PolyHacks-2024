import { getObjectsAndTransactionsOfUser, getUserFromID } from "$lib/db/db.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, params }) => {
    const session = await locals.auth();
    if (!session?.user) redirect(302, "/");

    const user = await getUserFromID(params.id);
    if (!user) redirect(302, "/");

    const objects = await getObjectsAndTransactionsOfUser(user.id);
    objects.sort((a, b) => (a.transaction ? -1 : 1));

    return { user, objects };
};
