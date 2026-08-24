# Déploiement sur le VPS (backend-oiacafecacao.com — 51.255.38.37)

## 0. DNS (chez OVH)

Créer/vérifier un enregistrement A sur `backend-oiacafecacao.com` (et `www`) pointant vers `51.255.38.37`. La propagation peut prendre jusqu'à 24-48h.

## 1. Prérequis sur le VPS

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs nginx git
sudo npm install -g pm2
```

## 2. Récupérer le code

```bash
git clone <url-du-repo> /var/www/oia-cafecacao-backend
cd /var/www/oia-cafecacao-backend
```

## 3. Configuration

```bash
cp .env.example .env
nano .env
```

Renseigner `DATABASE_URL`, `DIRECT_URL` (Neon), les identifiants admin par défaut, Cloudinary, et confirmer :

```
CORS_ORIGINS=https://backend-oiacafecacao.com,https://www.backend-oiacafecacao.com
PORT=3000
```

## 4. Build et migrations

```bash
npm ci
npm run prisma:generate
npm run prisma:deploy
npm run build
```

## 5. Démarrer avec PM2

```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup   # suivre l'instruction affichée pour démarrer PM2 au boot
```

## 6. Nginx (reverse proxy)

```bash
sudo cp deploy/nginx/backend-oiacafecacao.com.conf /etc/nginx/sites-available/backend-oiacafecacao.com.conf
sudo ln -s /etc/nginx/sites-available/backend-oiacafecacao.com.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## 7. HTTPS (Let's Encrypt)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d backend-oiacafecacao.com -d www.backend-oiacafecacao.com
```

Certbot modifie automatiquement `backend-oiacafecacao.com.conf` pour ajouter le bloc HTTPS et le renouvellement auto.

## 8. Vérification

```bash
curl -I https://backend-oiacafecacao.com/api-docs
```

## Mises à jour ultérieures

```bash
cd /var/www/oia-cafecacao-backend
git pull
npm ci
npm run prisma:deploy
npm run build
pm2 restart oia-cafecacao-backend
```
