export interface Restriction {
  id: string;
  idArrete: string,
  idZone: string;
  concerneParticulier: boolean;
  concerneEntreprise: boolean;
  concerneCollectivite: boolean;
  concerneExploitation: boolean;
  niveauRestriction: string;
  thematique: string;
  usage: string;
  usagePersonnalise: string;
  details: string;
  heureDebut: string;
  heureFin: string;
}
