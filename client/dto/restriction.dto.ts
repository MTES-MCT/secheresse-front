import { Usage } from "./usage.dto";
import { Arrete } from "./arrete.dto";

export interface Restriction {
  id: string;
  idZone: string;
  type: string;
  nom: string,
  departement: string;
  niveauAlerte: string
  arrete: Arrete;
  usages: Usage[];
}
