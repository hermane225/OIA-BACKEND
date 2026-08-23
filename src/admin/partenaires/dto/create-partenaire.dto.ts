export class CreatePartenaireDto {
  nom!: string;
  type?: string | null;
  typeOrgId?: number | string | null;
  description?: string | null;
  logo?: string | null;
  contactName?: string | null;
  contactEmail?: string | null;
  contactPhone?: string | null;
  site?: string | null;
}
