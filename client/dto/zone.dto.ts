import { Usage } from "./usage.dto";
import { Arrete } from "./arrete.dto";
import { Departement } from "./departement.dto";

export interface Zone {
  idZone: string;
  type: 'SUP' | 'SOU';
  profil: string;
  nom: string;
  departement: string;
  departementConfig: Departement;
  niveauAlerte: string;
  arrete: Arrete;
  usages: Usage[];
  usagesHash: string;
}
