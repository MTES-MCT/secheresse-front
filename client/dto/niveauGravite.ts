const niveauxGravite: any[] = [

  {
    text: 'Pas de restrictions',
    niveauGravite: null,
    class: 'situation-level-bg-0',
    description: 'Aucune restriction n\'est à appliquer.'
  },
  {
    text: 'Vigilance',
    niveauGravite: 'vigilance',
    class: 'situation-level-bg-1',
    description: 'Incitation des particuliers et des professionnels à économiser l’eau. (Sensibilisation mais pas de restriction)'
  },
  {
    text: 'Alerte',
    niveauGravite: 'alerte',
    class: 'situation-level-bg-2',
    description: 'Réduction de tous les prélèvements en eau et interdiction des activités impactant les milieux aquatiques. Restrictions d’arrosage, de remplissage et de vidange des piscines, de lavage des véhicules et d’irrigation de cultures.'
  },
  {
    text: 'Alerte renforcée',
    niveauGravite: 'alerte_renforcee',
    class: 'situation-level-bg-3',
    description: 'Réduction de tous les prélèvements en eau et interdiction des activités impactant les milieux aquatiques. Restrictions renforcées d’arrosage, de remplissage et de vidange des piscines, de lavage des véhicules et d’irrigation de cultures.'
  },
  {
    text: 'Crise',
    niveauGravite: 'crise',
    class: 'situation-level-bg-4',
    description: 'Ce niveau est déclenché pour préserver les usages prioritaires. Interdiction des prélèvements en eau pour l’agriculture (totalement ou partiellement), pour de nombreux usages domestiques et pour les espaces publics.'
  }
];

export default niveauxGravite;