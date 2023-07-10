export interface Departement {
  estValide: boolean;
  affichageRestrictionSiSuperpositionTypeZone: 'Affichage Prio Eau Sou' | 'Affichage Prio Eau Sup';
  appliqueNiveauGraviteMaxSiPlusieursTypeZoneMemeCommune: boolean;
  arDifferentAc: boolean;
}