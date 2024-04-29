import { Usage } from "./usage.dto";
import { Arrete } from "./arrete.dto";

export interface Zone {
  id: string;
  type: 'SUP' | 'SOU' | 'AEP';
  profil: string;
  nom: string;
  departement: string;
  niveauGravite: string;
  arrete: Arrete;
  usages: Usage[];
  usagesHash: string;
}
