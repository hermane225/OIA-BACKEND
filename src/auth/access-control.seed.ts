export interface PermissionSeed {
  code: string;
  label: string;
  description: string;
}

export interface RoleSeed {
  name: string;
  label: string;
  description: string;
  permissionCodes: string[];
}

export const CORE_PERMISSIONS: PermissionSeed[] = [
  {
    code: 'auth:me',
    label: 'Voir le profil',
    description: 'Permet de consulter les informations du compte connecte.',
  },
  {
    code: 'auth:logout',
    label: 'Se deconnecter',
    description: 'Permet de fermer la session en cours.',
  },
  {
    code: 'partenaires:read',
    label: 'Lire les partenaires',
    description: 'Permet de consulter la liste des partenaires.',
  },
  {
    code: 'partenaires:create',
    label: 'Creer un partenaire',
    description: 'Permet de creer un nouveau partenaire.',
  },
  {
    code: 'partenaires:update',
    label: 'Modifier un partenaire',
    description: 'Permet de mettre a jour un partenaire existant.',
  },
  {
    code: 'partenaires:delete',
    label: 'Supprimer un partenaire',
    description: 'Permet de supprimer un partenaire existant.',
  },
  {
    code: 'users:read',
    label: 'Lire les utilisateurs',
    description: 'Permet de consulter les comptes administrateurs.',
  },
  {
    code: 'users:create',
    label: 'Creer un utilisateur',
    description: 'Permet de creer un compte administrateur.',
  },
  {
    code: 'users:update',
    label: 'Modifier un utilisateur',
    description: 'Permet de modifier un compte administrateur.',
  },
  {
    code: 'users:delete',
    label: 'Supprimer un utilisateur',
    description: 'Permet de supprimer un compte administrateur.',
  },
  {
    code: 'roles:read',
    label: 'Lire les roles',
    description: 'Permet de consulter les roles disponibles.',
  },
  {
    code: 'roles:create',
    label: 'Creer un role',
    description: 'Permet de creer un nouveau role.',
  },
  {
    code: 'roles:update',
    label: 'Modifier un role',
    description: 'Permet de modifier un role existant.',
  },
  {
    code: 'roles:delete',
    label: 'Supprimer un role',
    description: 'Permet de supprimer un role existant.',
  },
  {
    code: 'permissions:read',
    label: 'Lire les permissions',
    description: 'Permet de consulter les permissions.',
  },
  {
    code: 'permissions:create',
    label: 'Creer une permission',
    description: 'Permet de creer une permission.',
  },
  {
    code: 'permissions:update',
    label: 'Modifier une permission',
    description: 'Permet de modifier une permission.',
  },
  {
    code: 'permissions:delete',
    label: 'Supprimer une permission',
    description: 'Permet de supprimer une permission.',
  },
  {
    code: 'categories:read',
    label: 'Lire les categories',
    description: "Permet de consulter les categories d'actualites.",
  },
  {
    code: 'categories:create',
    label: 'Creer une categorie',
    description: 'Permet de creer une nouvelle categorie.',
  },
  {
    code: 'categories:update',
    label: 'Modifier une categorie',
    description: 'Permet de modifier une categorie existante.',
  },
  {
    code: 'categories:delete',
    label: 'Supprimer une categorie',
    description: 'Permet de supprimer une categorie existante.',
  },
  {
    code: 'actualites:read',
    label: 'Lire les actualites',
    description:
      'Permet de consulter les actualites, y compris les brouillons.',
  },
  {
    code: 'actualites:create',
    label: 'Creer une actualite',
    description: 'Permet de creer une nouvelle actualite.',
  },
  {
    code: 'actualites:update',
    label: 'Modifier une actualite',
    description: 'Permet de modifier une actualite existante.',
  },
  {
    code: 'actualites:delete',
    label: 'Supprimer une actualite',
    description: 'Permet de supprimer une actualite existante.',
  },
  {
    code: 'actualites:publish',
    label: 'Publier une actualite',
    description: "Permet de changer le statut de publication d'une actualite.",
  },
  {
    code: 'agenda:read',
    label: 'Lire les evenements',
    description:
      "Permet de consulter les evenements de l'agenda, y compris les brouillons.",
  },
  {
    code: 'agenda:create',
    label: 'Creer un evenement',
    description: 'Permet de creer un nouvel evenement.',
  },
  {
    code: 'agenda:update',
    label: 'Modifier un evenement',
    description: 'Permet de modifier un evenement existant.',
  },
  {
    code: 'agenda:delete',
    label: 'Supprimer un evenement',
    description: 'Permet de supprimer un evenement existant.',
  },
  {
    code: 'agenda:publish',
    label: 'Publier un evenement',
    description: "Permet de changer le statut de publication d'un evenement.",
  },
  {
    code: 'documents:read',
    label: 'Lire les documents',
    description: 'Permet de consulter les documents du cadre reglementaire.',
  },
  {
    code: 'documents:create',
    label: 'Creer un document',
    description: 'Permet de creer un nouveau document.',
  },
  {
    code: 'documents:update',
    label: 'Modifier un document',
    description: 'Permet de modifier un document existant.',
  },
  {
    code: 'documents:delete',
    label: 'Supprimer un document',
    description: 'Permet de supprimer un document existant.',
  },
  {
    code: 'actes:read',
    label: 'Lire les actes OIA',
    description: "Permet de consulter les actes de l'OIA.",
  },
  {
    code: 'actes:create',
    label: 'Creer un acte OIA',
    description: 'Permet de creer un nouvel acte.',
  },
  {
    code: 'actes:update',
    label: 'Modifier un acte OIA',
    description: 'Permet de modifier un acte existant.',
  },
  {
    code: 'actes:delete',
    label: 'Supprimer un acte OIA',
    description: 'Permet de supprimer un acte existant.',
  },
  {
    code: 'projets:read',
    label: 'Lire les projets',
    description: 'Permet de consulter les projets.',
  },
  {
    code: 'projets:create',
    label: 'Creer un projet',
    description: 'Permet de creer un nouveau projet.',
  },
  {
    code: 'projets:update',
    label: 'Modifier un projet',
    description: 'Permet de modifier un projet existant.',
  },
  {
    code: 'projets:delete',
    label: 'Supprimer un projet',
    description: 'Permet de supprimer un projet existant.',
  },
  {
    code: 'photos:read',
    label: 'Lire les albums photos',
    description: 'Permet de consulter les albums et photos.',
  },
  {
    code: 'photos:create',
    label: 'Creer un album photo',
    description: 'Permet de creer un album photo.',
  },
  {
    code: 'photos:update',
    label: 'Modifier un album photo',
    description: 'Permet de modifier un album photo existant.',
  },
  {
    code: 'photos:delete',
    label: 'Supprimer un album photo',
    description: 'Permet de supprimer un album photo existant.',
  },
  {
    code: 'videos:read',
    label: 'Lire les videos',
    description: 'Permet de consulter les videos.',
  },
  {
    code: 'videos:create',
    label: 'Creer une video',
    description: 'Permet de creer une nouvelle video.',
  },
  {
    code: 'videos:update',
    label: 'Modifier une video',
    description: 'Permet de modifier une video existante.',
  },
  {
    code: 'videos:delete',
    label: 'Supprimer une video',
    description: 'Permet de supprimer une video existante.',
  },
  {
    code: 'pressbook:read',
    label: 'Lire le press book',
    description: 'Permet de consulter le press book.',
  },
  {
    code: 'pressbook:create',
    label: 'Creer un press book',
    description: 'Permet de creer un press book.',
  },
  {
    code: 'pressbook:update',
    label: 'Modifier un press book',
    description: 'Permet de modifier un press book existant.',
  },
  {
    code: 'pressbook:delete',
    label: 'Supprimer un press book',
    description: 'Permet de supprimer un press book existant.',
  },
  {
    code: 'campagnes:read',
    label: 'Lire les campagnes',
    description: 'Permet de consulter les campagnes.',
  },
  {
    code: 'campagnes:create',
    label: 'Creer une campagne',
    description: 'Permet de creer une nouvelle campagne.',
  },
  {
    code: 'campagnes:update',
    label: 'Modifier une campagne',
    description: 'Permet de modifier une campagne existante.',
  },
  {
    code: 'campagnes:delete',
    label: 'Supprimer une campagne',
    description: 'Permet de supprimer une campagne existante.',
  },
  {
    code: 'prixtendance:read',
    label: 'Lire les prix et tendances',
    description: 'Permet de consulter les prix, tendances et historiques.',
  },
  {
    code: 'prixtendance:create',
    label: 'Creer un prix ou historique',
    description: 'Permet de creer un prix, une tendance ou un historique.',
  },
  {
    code: 'prixtendance:update',
    label: 'Modifier un prix ou historique',
    description: 'Permet de modifier un prix, une tendance ou un historique.',
  },
  {
    code: 'prixtendance:delete',
    label: 'Supprimer un prix ou historique',
    description: 'Permet de supprimer un prix, une tendance ou un historique.',
  },
  {
    code: 'revuepresse:read',
    label: 'Lire la revue de presse',
    description: 'Permet de consulter la revue de presse.',
  },
  {
    code: 'revuepresse:create',
    label: 'Creer un article de revue de presse',
    description: 'Permet de creer un article de revue de presse.',
  },
  {
    code: 'revuepresse:update',
    label: 'Modifier un article de revue de presse',
    description: 'Permet de modifier un article de revue de presse existant.',
  },
  {
    code: 'revuepresse:delete',
    label: 'Supprimer un article de revue de presse',
    description: 'Permet de supprimer un article de revue de presse existant.',
  },
  {
    code: 'tableorg:read',
    label: 'Lire les types de partenaires',
    description:
      'Permet de consulter les types organisationnels de partenaires.',
  },
  {
    code: 'tableorg:create',
    label: 'Creer un type de partenaire',
    description: 'Permet de creer un type organisationnel de partenaire.',
  },
  {
    code: 'tableorg:update',
    label: 'Modifier un type de partenaire',
    description: 'Permet de modifier un type organisationnel de partenaire.',
  },
  {
    code: 'tableorg:delete',
    label: 'Supprimer un type de partenaire',
    description: 'Permet de supprimer un type organisationnel de partenaire.',
  },
  {
    code: 'contact:read',
    label: 'Lire les messages de contact',
    description:
      'Permet de consulter les messages recus via le formulaire de contact.',
  },
  {
    code: 'contact:update',
    label: 'Traiter les messages de contact',
    description: "Permet de changer le statut d'un message de contact.",
  },
  {
    code: 'contact:delete',
    label: 'Supprimer un message de contact',
    description: 'Permet de supprimer un message de contact.',
  },
  {
    code: 'settings:read',
    label: 'Lire les parametres du site',
    description:
      'Permet de consulter les parametres generaux et informations institutionnelles.',
  },
  {
    code: 'settings:update',
    label: 'Modifier les parametres du site',
    description:
      'Permet de mettre a jour les parametres generaux et informations institutionnelles.',
  },
  {
    code: 'media:read',
    label: 'Lire les medias',
    description: 'Permet de consulter la mediatheque (images, documents).',
  },
  {
    code: 'media:create',
    label: 'Televerser un media',
    description: 'Permet de televerser une image ou un document.',
  },
  {
    code: 'media:delete',
    label: 'Supprimer un media',
    description: 'Permet de supprimer un fichier de la mediatheque.',
  },
  {
    code: 'audit:read',
    label: "Lire le journal d'audit",
    description: 'Permet de consulter le journal des operations sensibles.',
  },
];

const permissionCodes = (predicate: (code: string) => boolean): string[] =>
  CORE_PERMISSIONS.map((permission) => permission.code).filter(predicate);

const ALL_PERMISSIONS = permissionCodes(() => true);

const ADMIN_PERMISSIONS = permissionCodes(
  (code) =>
    !code.startsWith('roles:') &&
    !code.startsWith('permissions:') &&
    code !== 'users:delete' &&
    code !== 'audit:read',
);

const EDITOR_PERMISSIONS = [
  'auth:me',
  'auth:logout',
  'categories:read',
  'categories:create',
  'categories:update',
  'actualites:read',
  'actualites:create',
  'actualites:update',
  'actualites:publish',
  'agenda:read',
  'agenda:create',
  'agenda:update',
  'agenda:publish',
  'documents:read',
  'documents:create',
  'documents:update',
  'actes:read',
  'actes:create',
  'actes:update',
  'projets:read',
  'projets:create',
  'projets:update',
  'photos:read',
  'photos:create',
  'photos:update',
  'videos:read',
  'videos:create',
  'videos:update',
  'pressbook:read',
  'pressbook:create',
  'pressbook:update',
  'campagnes:read',
  'campagnes:create',
  'campagnes:update',
  'prixtendance:read',
  'prixtendance:create',
  'prixtendance:update',
  'revuepresse:read',
  'revuepresse:create',
  'revuepresse:update',
  'partenaires:read',
  'contact:read',
  'media:read',
  'media:create',
  'settings:read',
];

const MANAGER_PERMISSIONS = [
  'auth:me',
  'auth:logout',
  'categories:read',
  'actualites:read',
  'agenda:read',
  'documents:read',
  'actes:read',
  'projets:read',
  'photos:read',
  'videos:read',
  'pressbook:read',
  'campagnes:read',
  'prixtendance:read',
  'revuepresse:read',
  'partenaires:read',
  'contact:read',
  'contact:update',
  'media:read',
  'settings:read',
];

export const CORE_ROLES: RoleSeed[] = [
  {
    name: 'super_admin',
    label: 'Super administrateur',
    description: 'Acces complet a toutes les fonctionnalites.',
    permissionCodes: ALL_PERMISSIONS,
  },
  {
    name: 'admin',
    label: 'Administrateur',
    description: 'Gestion generale des contenus et des utilisateurs.',
    permissionCodes: ADMIN_PERMISSIONS,
  },
  {
    name: 'editor',
    label: 'Editeur',
    description: 'Creation et modification des contenus editoriaux.',
    permissionCodes: EDITOR_PERMISSIONS,
  },
  {
    name: 'manager',
    label: 'Gestionnaire',
    description:
      'Acces limite aux rubriques assignees (consultation et messages de contact).',
    permissionCodes: MANAGER_PERMISSIONS,
  },
];

export const DEFAULT_SUPER_ADMIN_ROLE = 'super_admin';
