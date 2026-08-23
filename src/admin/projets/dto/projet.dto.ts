export class CreateProjetDto {
  titre!: string;
  description?: string | null;
  dateDeb?: string | null;
  dateFin?: string | null;
  imageCouverture?: string | null;
  pdfFile?: string | null;
  datePub?: string | null;
}

export class UpdateProjetDto {
  titre?: string;
  description?: string | null;
  dateDeb?: string | null;
  dateFin?: string | null;
  imageCouverture?: string | null;
  pdfFile?: string | null;
  datePub?: string | null;
}
