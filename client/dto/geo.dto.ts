export interface Geo {
  code: string;
  nom: string;
  mairie: {
    coordinates: number[];
  },
  centre: {
    coordinates: number[];
  }
}