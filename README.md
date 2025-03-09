# OurBlog

## Installation 
### Prérequis 
* Node.js
* pnpm 
```bash
npm install -g pnpm
```

### Étapes 
1. **Cloner le dépôt**
```bash
git clone https://github.com/SohamHUG/OurBlog.git
cd OurBlog
```

2. **Configurer l'environnement**
* Dupliquer le fichier **.env.example** en **.env** et remplir les valeurs nécessaires
```bash
cp .env.example .env
```
* Variables importantes
    * DB_HOST
    * DB_USER
    * DB_PASSWORD
    * DB_NAME
    * JWT_SECRET
    * REFRESH_TOKEN_SECRET
    * JWT_EXPIRATION
    * REFRESH_TOKEN_EXPIRATION
    * EMAIL_USER
    * EMAIL_PASSWORD
    * CLOUDINARY_CLOUD_NAME
    * CLOUDINARY_API_KEY
    * CLOUDINARY_API_SECRET

3. **Installer les dépendances**
```bash
pnpm install
```

4. **Lancer l'application**
```bash
pnpm run dev
```

## Scripts
* `pnpm run dev:client` : Lancer le client (front)
* `pnpm run dev:server` : Lancer le serveur (back)
* `pnpm run dev` : Lancer les deux en même temps
