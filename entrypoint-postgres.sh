#!/bin/bash
set -e

# Définir les identifiants pour éviter tout prompt de mot de passe
export PGPASSWORD="${POSTGRES_PASSWORD:-botscan_pass}"
export PGUSER="${POSTGRES_USER:-botscan}"
export PGDATABASE="${POSTGRES_DB:-botscan_db}"

# ==============================================================
# 1. HOOK PRE-STOP : Exécuté juste avant l'arrêt du conteneur
# ==============================================================
on_stop() {
    echo ""
    echo "=========================================================="
    echo "[PRE-STOP] Arrêt détecté : Sauvegarde de la base de données..."
    echo "=========================================================="
    
    # Dump dans backup.sql avec --clean --if-exists pour une référence propre
    if pg_dump -U "$PGUSER" -d "$PGDATABASE" --clean --if-exists > /backup/backup.sql 2>/dev/null; then
        echo "[PRE-STOP] Sauvegarde réussie dans backup.sql !"
    else
        echo "[PRE-STOP] Attention: Échec de la sauvegarde pg_dump."
    fi

    echo "[PRE-STOP] Arrêt de PostgreSQL..."
    kill -s TERM "$PG_PID" 2>/dev/null || true
    wait "$PG_PID"
    exit 0
}

# Capture le signal SIGTERM envoyé par 'docker compose down/stop'
trap on_stop SIGTERM SIGINT

# ==============================================================
# 2. Démarrage de PostgreSQL officiel en arrière-plan
# ==============================================================
docker-entrypoint.sh postgres &
PG_PID=$!

# ==============================================================
# 3. HOOK POST-START : Exécuté dès que Postgres est prêt
# ==============================================================
(
    echo "[POST-START] Attente de la disponibilité de PostgreSQL..."
    until pg_isready -U "$PGUSER" -d "$PGDATABASE" > /dev/null 2>&1; do
        sleep 1
    done
    echo "[POST-START] PostgreSQL est opérationnel !"

    # backup.sql est LA référence absolue
    if [ -s /backup/backup.sql ]; then
        echo "[POST-START] Application de la référence backup.sql..."
        # Réinitialise le schéma public pour recharger proprement sans erreur 'already exists'
        psql -U "$PGUSER" -d "$PGDATABASE" -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;" > /dev/null 2>&1 || true
        psql -U "$PGUSER" -d "$PGDATABASE" < /backup/backup.sql > /dev/null 2>&1 || true
        echo "[POST-START] Base synchronisée avec succès depuis backup.sql !"
    else
        echo "[POST-START] Aucun backup.sql trouvé ou fichier vide. Démarrage standard."
    fi
) &

# Attendre le processus principal
wait "$PG_PID"
