import { createClient } from "@/lib/supabase/server";

const TIMEOUT_MS = 30_000;

export async function uploadKudosImage(
  file: File,
  userId: string
): Promise<{ url: string }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const supabase = await createClient();
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error } = await supabase.storage
      .from("kudos-images")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) throw error;

    const { data: publicData } = supabase.storage
      .from("kudos-images")
      .getPublicUrl(path);

    return { url: publicData.publicUrl };
  } catch (err) {
    if (controller.signal.aborted) {
      throw new Error("Upload timed out — please try again");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
