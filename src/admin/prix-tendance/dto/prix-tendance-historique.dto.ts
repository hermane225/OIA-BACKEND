export class CreatePrixTendanceHistoriqueDto {
  prixTendanceId!: number | string;
  campagneId?: number | string | null;
  prixNat!: number | string;
  prixInter!: number | string;
  pmgBordChamp?: number | string | null;
  differentielRamassage?: number | string | null;
  forfaitTransport?: number | string | null;
  entreeUsine?: number | string | null;
  locoMagasin?: number | string | null;
  fobGaranti?: number | string | null;
  cafGarantiEu?: number | string | null;
}

export class UpdatePrixTendanceHistoriqueDto {
  campagneId?: number | string | null;
  prixNat?: number | string;
  prixInter?: number | string;
  pmgBordChamp?: number | string | null;
  differentielRamassage?: number | string | null;
  forfaitTransport?: number | string | null;
  entreeUsine?: number | string | null;
  locoMagasin?: number | string | null;
  fobGaranti?: number | string | null;
  cafGarantiEu?: number | string | null;
}
