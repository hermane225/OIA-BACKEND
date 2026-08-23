export class CreateDocumentDto {
  titre!: string;
  description?: string | null;
  pdfFile!: string;
  datePub?: string | null;
}

export class UpdateDocumentDto {
  titre?: string;
  description?: string | null;
  pdfFile?: string;
  datePub?: string | null;
}
