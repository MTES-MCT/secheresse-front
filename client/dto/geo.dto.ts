export interface Geo {
  code: string;
  nom: string;
  codeDepartement: string;
  mairie: {
    coordinates: number[];
  },
  centre: {
    coordinates: number[];
  }
}