import { GetObjectCommand } from "@aws-sdk/client-s3";

import { WAIT_FOR_S3 } from "~/lib/constants";
import { insertLocationLogImage } from "~/lib/db/queries/location-log-image";
import { InsertLocationLogImage } from "~/lib/db/schema";
import env from "~/lib/env";
import createS3Client from "~/utils/create-s3-client";
import defineAuthenticatedEventHandler from "~/utils/define-authenticated-event-handler";
import sendZodError from "~/utils/send-zod-error";

type ObjectMetadata = {
    "location-log-id": string;
    "user-id": string;
};

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertLocationLogImage.safeParse);

    if (!result.success) {
        return sendZodError(event, result.error);
    }

    const slug = getRouterParam(event, "slug") as string;
    const id = getRouterParam(event, "id") as string;

    await event.$fetch(`/api/locations/${slug}/${id}`);

    await new Promise(resolve => setTimeout(resolve, WAIT_FOR_S3));

    const client = createS3Client();
    const command = new GetObjectCommand({
        Bucket: env.S3_BUCKET,
        Key: result.data.key,
    });

    try {
        const response = await client.send(command);
        const metadata = response.Metadata as ObjectMetadata | undefined;

        if (!metadata
            || metadata["location-log-id"] !== id
            || metadata["user-id"] !== event.context.user.id.toString()) {
            return createError({
                statusCode: 404,
                statusMessage: "Image metadata validation failed",
            });
        }

        const inserted = await insertLocationLogImage(Number(id), result.data, event.context.user.id);
        return inserted;
    }
    catch (error: any) {
        if (error.name === "NoSuchKey") {
            return createError({
                statusCode: 404,
                statusMessage: "S3 object not found",
            });
        }
        throw error;
    }
});
