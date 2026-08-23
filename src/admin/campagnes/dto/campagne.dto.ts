export class CreateCampagneDto {
  nom!: string;
  typeCampagne?: string | null;
  dateDebut!: string;
  dateFin!: string;
  statut?: string | null;
}

export class UpdateCampagneDto {
  nom?: string;
  typeCampagne?: string | null;
  dateDebut?: string;
  dateFin?: string;
  statut?: string | null;
}
