export class SiteSettingEntryDto {
  cle!: string;
  valeur?: string | null;
}

export class UpsertSiteSettingsDto {
  settings!: SiteSettingEntryDto[];
}
