export class CreateOrganigrammeDto {
  image!: string;
  actif?: boolean | string;
}

export class UpdateOrganigrammeDto {
  image?: string;
  actif?: boolean | string;
}
