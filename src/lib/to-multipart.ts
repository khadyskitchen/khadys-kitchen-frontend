/**
 * Wraps a JSON body plus named files into the multipart shape the backend's
 * `parseJsonPayload` + upload middleware expect: the JSON under `payload`,
 * each file under its backend field name. Skips undefined files so callers
 * can pass their whole file map unconditionally.
 */
export function toMultipart(
  body: unknown,
  files: Record<string, File | undefined>,
): FormData {
  const form = new FormData();
  form.append("payload", JSON.stringify(body));
  for (const [field, file] of Object.entries(files)) {
    if (file) form.append(field, file);
  }
  return form;
}
