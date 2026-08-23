export class PhotoInput {
  titre!: string;
  photoFile!: string;
}

export class CreatePhotoAlbumDto {
  titre!: string;
  description?: string | null;
  datePub?: string | null;
  photos?: PhotoInput[];
}

export class UpdatePhotoAlbumDto {
  titre?: string;
  description?: string | null;
  datePub?: string | null;
  photos?: PhotoInput[];
}
