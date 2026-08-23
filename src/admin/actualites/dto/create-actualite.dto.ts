export class CreateActualiteDto {
  titre!: string;
  slug?: string | null;
  contenu!: string;
  extrait?: string | null;
  auteur!: string;
  categorieId?: number | string | null;
  imagePrincipale?: string | null;
  statut?: string | null;
  datePub?: string | null;
}
