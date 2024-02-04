import { getUser } from "$lib/db/db.js";
import { generateV4UploadSignedUrl } from "$lib/gcs.js";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const session = await locals.auth();
    if (!session?.user?.email) redirect(302, "/");

    const user = await getUser(session.user.email);
    if (!user) redirect(302, "/");

    const { url } = await generateV4UploadSignedUrl("commupartage_user_images", user.id);

    return { signedUrl: url };
};
