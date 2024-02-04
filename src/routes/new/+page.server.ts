import { generateRandomString, generateV4UploadSignedUrl } from "$lib/gcs";
import { redirect } from "@sveltejs/kit";

export const load = async ({ locals }) => {
    const user = await locals.auth();
    if (!user?.user?.email) redirect(302, "/");

    const id = generateRandomString(24);
    const { url } = await generateV4UploadSignedUrl("commupartage_object_images", id);

    return {
        id,
        signedUrl: url,
    };
};
