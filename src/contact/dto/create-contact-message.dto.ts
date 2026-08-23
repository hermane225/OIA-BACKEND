export class CreateContactMessageDto {
  nom!: string;
  email!: string;
  telephone?: string | null;
  sujet?: string | null;
  message!: string;
}
