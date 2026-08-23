export class AgendaDocumentInput {
  titre!: string;
  url!: string;
}

export class CreateAgendaDto {
  titre!: string;
  description?: string | null;
  dateDeb!: string;
  dateFin?: string | null;
  heureDeb?: string | null;
  heureFin?: string | null;
  ville?: string | null;
  adresse?: string | null;
  infosPratiques?: string | null;
  imageCouverture?: string | null;
  statut?: string | null;
  datePub?: string | null;
  images?: string[];
  documents?: AgendaDocumentInput[];
}
