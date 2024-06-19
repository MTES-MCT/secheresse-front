export interface Usage {
  id: number;
  thematique: string;
  nom: string;
  description: string;
  erreur: string;
  concerneParticulier: boolean;
  concerneEntreprise: boolean;
  concerneCollectivite: boolean;
  concerneExploitation: boolean;
}