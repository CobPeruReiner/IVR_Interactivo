export interface CarteraSuccesResponse {
  ok: boolean;
  carteras: Cartera[];
}

export interface Cartera {
  id: number;
  cartera: string;
  tipo: number | null;
  tramo: string;
  central: null | string;
  idcliente: number;
  fecha_registro: Date | null;
  fecha_baja: Date | null;
  estado: number;
  idAnalistabd: number;
}
