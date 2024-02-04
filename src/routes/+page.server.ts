import { getObjects, getUser } from "$lib/db/db";

export const load = async ({ locals }) => {
    const user = await locals.auth().then((s) => (s?.user?.email ? getUser(s.user.email) : null));
    const objects = await getObjects(user?.id ?? "");

    return { objects };
};
