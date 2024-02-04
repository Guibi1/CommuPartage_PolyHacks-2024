import { getUser, insertUser } from "$lib/db/db";
import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";

export const load: LayoutServerLoad = async ({ locals }) => {
    const session = await locals.auth();
    if (session?.user?.email) {
        const user = await getUser(session.user.email);
        if (!user) {
            await insertUser({
                name: session.user.name!,
                email: session.user.email,
                avatar: session.user.image!,
                position: {
                    lat: 0,
                    lng: 0,
                },
            });
            redirect(302, "/verify");
        }
    }

    return { user: session?.user };
};
