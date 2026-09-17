export class CreateFiliereStatDto {
  filiere!: string;
  ordre?: number | string | null;
  valeur!: string;
  libelle!: string;
  description?: string | null;
}

export class UpdateFiliereStatDto {
  filiere?: string;
  ordre?: number | string | null;
  valeur?: string;
  libelle?: string;
  description?: string | null;
}
