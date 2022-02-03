export interface AuthProviderButtonsProps {
  mode: 'login' | 'register';
  providers: AuthProvider[];
}

export interface AuthProvider {
  name: string;
  id: string;
}