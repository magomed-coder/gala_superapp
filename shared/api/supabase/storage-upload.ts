import { Buffer } from "buffer";
import { File } from "expo-file-system";
import { supabase } from "@/shared/api/supabase/supabase";

type UploadImageParams = {
  bucket: string;
  uri: string;
  pathPrefix: string;
  fileName?: string | null;
  mimeType?: string | null;
};

function getFileExtension(params: {
  uri: string;
  fileName?: string | null;
  mimeType?: string | null;
}) {
  const { uri, fileName, mimeType } = params;

  if (fileName && fileName.includes(".")) {
    return fileName.split(".").pop()?.toLowerCase() ?? "jpg";
  }

  if (mimeType?.includes("/")) {
    return mimeType.split("/")[1]?.toLowerCase() ?? "jpg";
  }

  const fromUri = uri.split("?")[0].split(".").pop()?.toLowerCase();
  return fromUri && fromUri.length <= 5 ? fromUri : "jpg";
}

export function deleteImageFromBucket(bucket: string, publicUrl: string): void {
  if (!publicUrl) return;

  try {
    const match = publicUrl.match(
      /\/storage\/v1\/object\/public\/[^/]+\/(.+)$/,
    );
    if (!match || !match[1]) return;

    const objectPath = match[1];
    supabase.storage
      .from(bucket)
      .remove([objectPath])
      .catch(() => {
        // Silently fail on delete errors
      });
  } catch {
    // Silently fail on any errors
  }
}

export async function uploadImageToBucket({
  bucket,
  uri,
  pathPrefix,
  fileName,
  mimeType,
}: UploadImageParams): Promise<string> {
  const extension = getFileExtension({ uri, fileName, mimeType });
  const objectPath = `${pathPrefix}/${Date.now()}.${extension}`;

  const file = new File(uri);
  const fileBase64 = await file.base64();
  const fileBuffer = Buffer.from(fileBase64, "base64");

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(objectPath, fileBuffer, {
      upsert: true,
      contentType: mimeType ?? undefined,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(objectPath);

  if (!data.publicUrl) {
    throw new Error("Failed to get public URL for uploaded image");
  }

  return data.publicUrl;
}
