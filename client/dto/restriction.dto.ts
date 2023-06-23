import { Usage } from "./usage.dto";
import { Arrete } from "./arrete.dto";
import { Departement } from "./dto/departement.dto";

export interface Restriction {
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
