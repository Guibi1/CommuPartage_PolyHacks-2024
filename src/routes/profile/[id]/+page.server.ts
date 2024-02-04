import {
    getFullReviews,
    getObjectsAndTransactionsOfUser,
    getUser,
    getUserFromID,
} from "$lib/db/db.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, params }) => {
    const session = await locals.auth();
    if (!session?.user?.email) redirect(302, "/");
    const currUser = await getUser(session.user.email);

    if (currUser?.id === params.id) redirect(302, "/profile");

    const user = await getUserFromID(params.id);
    if (!user) redirect(302, "/");

    const reviews = await getFullReviews(user.id);
    console.log("🚀 ~ load ~ reviews:", reviews);
    const objects = await getObjectsAndTransactionsOfUser(user.id);
    objects.sort((a, b) => (a.transaction ? -1 : 1));

    return { currUser, user, objects, reviews };
};
