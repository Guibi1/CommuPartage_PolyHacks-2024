import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const session = await locals.auth();

    if (session) redirect(302, "/verify");
};
