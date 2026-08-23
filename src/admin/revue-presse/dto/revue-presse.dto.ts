export class CreateRevuePresseDto {
  auteur!: string;
  titre!: string;
  description?: string | null;
  imageCouverture?: string | null;
  datePub?: string | null;
}

export class UpdateRevuePresseDto {
  auteur?: string;
  titre?: string;
  description?: string | null;
  imageCouverture?: string | null;
  datePub?: string | null;
}
