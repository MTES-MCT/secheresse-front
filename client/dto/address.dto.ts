export interface Address {
  geometry: {
    coordinates: number[];
  },
  properties: {
    postcode: string;
    label: string;
  };
}