export class PressBookPhotoInput {
  titre!: string;
  photoFile!: string;
}

export class PressBookVideoInput {
  titre?: string | null;
  youtubeUrl!: string;
}

export class CreatePressBookDto {
  titre!: string;
  description?: string | null;
  datePub?: string | null;
  photos?: PressBookPhotoInput[];
  videos?: PressBookVideoInput[];
}

export class UpdatePressBookDto {
  titre?: string;
  description?: string | null;
  datePub?: string | null;
  photos?: PressBookPhotoInput[];
  videos?: PressBookVideoInput[];
}
