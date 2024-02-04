import { getUser } from "$lib/db/db.js";
import { generateV4UploadSignedUrl } from "$lib/gcs";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals, params }) => {
    const session = await locals.auth();
    if (!session?.user?.email) redirect(302, "/");

    const user = await getUser(session.user.email);
    if (!user) redirect(302, "/");

    const start = params.type === "start";

    const { url } = await generateV4UploadSignedUrl(
        start ? "commupartage_transaction_start_images" : "commupartage_transaction_end_image",
        params.id
    );

    return {
        start,
        signedUrl: url,
    };
};
