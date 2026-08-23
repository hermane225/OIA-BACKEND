export class CreateActeOiaDto {
  titre!: string;
  description?: string | null;
  pdfFile!: string;
  datePub?: string | null;
}

export class UpdateActeOiaDto {
  titre?: string;
  description?: string | null;
  pdfFile?: string;
  datePub?: string | null;
}
