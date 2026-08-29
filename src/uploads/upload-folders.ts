export type UploadFolder =
  | 'revue-presses'
  | 'agendas'
  | 'acte-oia'
  | 'presse-books'
  | 'documents'
  | 'photos'
  | 'projets'
  | 'avatars';

const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
];
const PDF_MIME_TYPE = 'application/pdf';

export const FOLDER_ACCEPTED_MIME_TYPES: Record<UploadFolder, string[]> = {
  'revue-presses': IMAGE_MIME_TYPES,
  agendas: [...IMAGE_MIME_TYPES, PDF_MIME_TYPE],
  'acte-oia': [PDF_MIME_TYPE],
  'presse-books': IMAGE_MIME_TYPES,
  documents: [PDF_MIME_TYPE],
  photos: IMAGE_MIME_TYPES,
  projets: [...IMAGE_MIME_TYPES, PDF_MIME_TYPE],
  avatars: IMAGE_MIME_TYPES,
};

export const UPLOAD_FOLDERS = Object.keys(
  FOLDER_ACCEPTED_MIME_TYPES,
) as UploadFolder[];

export const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
