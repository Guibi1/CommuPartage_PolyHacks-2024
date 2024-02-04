import { getUser, insertObject } from "$lib/db/db";
import { generateRandomString, generateV4UploadSignedUrl } from "$lib/gcs";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import { superValidate } from "sveltekit-superforms/server";
import { newObjectSchema } from "./newObjectSchema";

export const load = async ({ locals }) => {
    const user = await locals.auth();
    if (!user?.user?.email) redirect(302, "/");

    const form = await superValidate(newObjectSchema);

    const id = generateRandomString(24);
    const { url } = await generateV4UploadSignedUrl("commupartage_object_images", id);

    return {
        id,
        signedUrl: url,
        form,
    };
};

export const actions: Actions = {
    default: async (event) => {
        const session = await event.locals.auth();
        console.log("🚀 ~ default: ~ session:", session);
        if (!session?.user?.email) redirect(302, "/");

        const user = await getUser(session.user.email);
        console.log("🚀 ~ default: ~ user:", user);
        if (!user?.id) redirect(302, "/");

        const j = await event.request.json();
        console.log("🚀 ~ default: ~ j:", j);
        const form = await superValidate(j, newObjectSchema);
        console.log("🚀 ~ default: ~ form:", form);
        if (!form.valid) {
            return fail(400, { form });
        }

        console.log("🚀 ~ default: ~ form:", form.data);
        const res = await insertObject({ ...form.data, owner_id: user.id });
        console.log("🚀 ~ default: ~ await insertObject(form.data):", res);
        redirect(302, "/profile");
    },
};
