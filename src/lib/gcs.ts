import { GOOGLE_CLOUD_CREDENTIALS } from "$env/static/private";
import { Storage } from "@google-cloud/storage";

type BucketName =
    | "commupartage_object_images"
    | "commupartage_user_images"
    | "commupartage_transaction_end_image"
    | "commupartage_transaction_start_images";

const storage = new Storage({
    credentials: JSON.parse(GOOGLE_CLOUD_CREDENTIALS),
});

export async function generateV4UploadSignedUrl(bucket: BucketName, filename: string) {
    const [url] = await storage
        .bucket(bucket)
        .file(filename)
        .getSignedUrl({
            version: "v4",
            action: "write",
            expires: Date.now() + 15 * 60 * 1000, // 15 minutes
            contentType: "application/octet-stream",
        });

    return { url, filename };
}

async function configureBucketCors() {
    const options = {
        maxAgeSeconds: 3600,
        method: ["PUT", "GET"],
        origin: ["http://localhost:5173", "https://commupartage.vercel.app"],
        responseHeader: ["Content-Type"],
    };
    console.log("🚀 ~ configureBucketCors ~ options:", options);

    await storage
        .bucket("commupartage_user_images" satisfies BucketName)
        .setCorsConfiguration([options]);

    console.log("Bucket CORS set!");
}
// configureBucketCors().catch(console.error);

export function generateRandomString(length: number) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    const randomBytes = crypto.getRandomValues(new Uint8Array(length));

    let result = "";
    for (let i = 0; i < length; i++) {
        result += charset.charAt(randomBytes[i] % charset.length);
    }

    return result;
}
