import { AgendaDocumentInput } from './create-agenda.dto';

export class UpdateAgendaDto {
  titre?: string;
  description?: string | null;
  dateDeb?: string;
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
