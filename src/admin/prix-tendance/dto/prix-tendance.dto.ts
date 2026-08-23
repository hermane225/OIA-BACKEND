export class CreatePrixTendanceDto {
  name!: string;
  description?: string | null;
}

export class UpdatePrixTendanceDto {
  name?: string;
  description?: string | null;
}
