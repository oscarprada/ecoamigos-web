export const formats = Object.assign(Object.create(null), {
  jpg: { mime: 'image/jpeg', aliases: ['image/jpeg'], kind: 'image' },
  png: { mime: 'image/png', aliases: ['image/png'], kind: 'image' },
  webp: { mime: 'image/webp', aliases: ['image/webp'], kind: 'image' },
  mp4: { mime: 'video/mp4', aliases: ['video/mp4'], kind: 'video' },
  mov: { mime: 'video/quicktime', aliases: ['video/quicktime'], kind: 'video' },
  avi: { mime: 'video/x-msvideo', aliases: ['video/x-msvideo', 'video/avi', 'video/msvideo', 'video/vnd.avi'], kind: 'video' },
  pdf: { mime: 'application/pdf', aliases: ['application/pdf'], kind: 'file' },
  docx: { mime: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', aliases: ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'], kind: 'file' },
});
export const extension = name => String(name).split('.').at(-1).toLowerCase().replace(/^jpeg$/, 'jpg');
export class FileError extends Error { constructor(status, message) { super(message); this.status = status; } }
export function fileLimits() {
  const mb = (name, fallback) => {
    const value = Number(process.env[name] || fallback);
    if (!Number.isInteger(value) || value < 1 || value > 500) throw Error('Invalid upload limit');
    return value * 1024 * 1024;
  };
  return { image: mb('UPLOAD_IMAGE_MB',10), file: mb('UPLOAD_DOCUMENT_MB',20), video: mb('UPLOAD_VIDEO_MB',100), evidence: mb('UPLOAD_EVIDENCE_MB',20) };
}
