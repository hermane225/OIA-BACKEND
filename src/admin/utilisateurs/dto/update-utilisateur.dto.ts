export class UpdateUtilisateurDto {
  nom?: string;
  prenom?: string;
  mail?: string;
  password?: string;
  phone?: string | null;
  avatar?: string | null;
  roleId?: number | string | null;
}
