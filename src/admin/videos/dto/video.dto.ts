export class CreateVideoDto {
  auteur!: string;
  titre!: string;
  youtubeUrl?: string | null;
  datePub?: string | null;
}

export class UpdateVideoDto {
  auteur?: string;
  titre?: string;
  youtubeUrl?: string | null;
  datePub?: string | null;
}
