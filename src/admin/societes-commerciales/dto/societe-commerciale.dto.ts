export class CreateSocieteCommercialeDto {
  nom!: string;
  type!: string;
  numeroAgrement?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  campagneId?: number | string | null;
  actif?: boolean;
}

export class UpdateSocieteCommercialeDto {
  nom?: string;
  type?: string;
  numeroAgrement?: string | null;
  adresse?: string | null;
  ville?: string | null;
  telephone?: string | null;
  email?: string | null;
  campagneId?: number | string | null;
  actif?: boolean;
}
