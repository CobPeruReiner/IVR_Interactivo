export interface CredentialsLoginState {
  usuario: string;
  password: string;
}

export interface AuthContextProps {
  auth: AuthInitialState;
  responseToken: boolean;
  LogoutRequest: () => void;
  LoginRequest: (credentials: CredentialsLoginState) => Promise<boolean>;
  RefreshTokenRequest: () => Promise<boolean>;
}

export interface AuthInitialState {
  checking: boolean;
  user: User | null;
  logged: boolean;
}

export interface SuccesResponseLogin {
  ok: boolean;
  user: User;
  token: string;
}

export interface User {
  IDPERSONAL: number;
  APELLIDOS: string;
  NOMBRES: string;
  FECHANAC: Date;
  SEXO: number;
  DOC: string;
  ESTCIV: number;
  CARFAM: number;
  NUMHIJ: number;
  DIRECCION: string;
  DISTRITO: string;
  DPTO: string;
  REFDIR: string;
  TLF: string;
  CEL: string;
  EMAIL: string;
  GRADOINS: number;
  CARGO: number;
  IDSUCURSAL: number;
  USUARIO: string;
  PASSWORD: string;
  IDESTADO: number;
  fecha_registro: Date;
  fecha_baja: Date;
  id_cartera: null;
  api_token: string;
  fecha_ing: Date;
  TIPO_PERSONAL: string;
  ANYDESK: string;
  ANEXO_BACKUP: number;
  ID_FORMA_CONTRATACION: null;
}
