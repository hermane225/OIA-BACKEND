export class UpdateProfileDto {
  nom?: string;
  prenom?: string;
  phone?: string | null;
  avatar?: string | null;
  currentPassword?: string;
  newPassword?: string;
}
