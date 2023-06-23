import { Usage } from "./usage.dto";
import { Arrete } from "./arrete.dto";

export interface Restriction {
  idZone: string;
  type: 'SUP' | 'SOU';
  profil: string;
  nom: string;
  departement: string;
  niveauAlerte: string;
  arrete: Arrete;
  usages: Usage[];
  usagesHash: string;
}
