import { Request } from 'express';

export interface AuthenticatedRole {
  id: number;
  name: string;
  label: string;
  description: string | null;
}

export interface AuthenticatedUser {
  id: number;
  nom: string;
  prenom: string;
  mail: string;
  phone: string | null;
  avatar: string | null;
  role: AuthenticatedRole | null;
  permissions: string[];
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
  authSessionToken?: string;
}
