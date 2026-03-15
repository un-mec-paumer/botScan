-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT,
    "username" TEXT,
    "picture" BYTEA,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastLogin" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."auth_tokens" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "refreshExpiresAt" TIMESTAMP(3) NOT NULL,
    "revoked" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userAgent" TEXT,
    "ipAddress" TEXT,

    CONSTRAINT "auth_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."works" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "synopsis" TEXT,
    "imgUrl" TEXT,
    -- "mangaSource" TEXT,
    "mangaChapter" TEXT,
    -- "animeSource" TEXT,
    "animeSeason" TEXT,
    "animeEpisode" TEXT,

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")

);

CREATE TABLE "public"."manga_sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "manga_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."anime_sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "anime_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."manga_source_works" (
    "mangaSourceId" INTEGER NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "manga_source_works_pkey" PRIMARY KEY ("mangaSourceId", "workId")
);

CREATE TABLE "public"."anime_source_works" (
    "animeSourceId" INTEGER NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "anime_source_works_pkey" PRIMARY KEY ("animeSourceId", "workId")
);

-- CreateTable
CREATE TABLE "public"."alerts" (
    "userId" TEXT NOT NULL,
    "workId" INTEGER NOT NULL,
    "mangaAlert" BOOLEAN NOT NULL DEFAULT false,
    "animeAlert" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("userId","workId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_refreshToken_key" ON "public"."auth_tokens"("refreshToken");

-- AddForeignKey
ALTER TABLE "public"."auth_tokens" ADD CONSTRAINT "auth_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."alerts" ADD CONSTRAINT "alerts_workId_fkey" FOREIGN KEY ("workId") REFERENCES "public"."works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manga_source_works" ADD CONSTRAINT "manga_source_works_mangaSourceId_fkey" FOREIGN KEY ("mangaSourceId") REFERENCES "public"."manga_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."manga_source_works" ADD CONSTRAINT "manga_source_works_workId_fkey" FOREIGN KEY ("workId") REFERENCES "public"."works"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."anime_source_works" ADD CONSTRAINT "anime_source_works_animeSourceId_fkey" FOREIGN KEY ("animeSourceId") REFERENCES "public"."anime_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."anime_source_works" ADD CONSTRAINT "anime_source_works_workId_fkey" FOREIGN KEY ("workId") REFERENCES "public"."works"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- 1. Insertion des sources (Manga & Anime)
INSERT INTO "public"."manga_sources" ("id", "name") VALUES 
(1, 'MangaDex'),
(2, 'Shonen Jump+'),
(3, 'Scantrad France');

INSERT INTO "public"."anime_sources" ("id", "name") VALUES 
(1, 'Crunchyroll'),
(2, 'Netflix'),
(3, 'Animation Digital Network (ADN)');

-- 2. Insertion des utilisateurs
-- Note : "updatedAt" est requis car il n'a pas de valeur par défaut dans votre schéma.
INSERT INTO "public"."users" ("id", "email", "passwordHash", "username", "updatedAt") VALUES 
('usr_12345abcde', 'alice@example.com', '$2b$10$xyzFakeHash12345', 'AliceOtaku', CURRENT_TIMESTAMP),
('usr_67890fghij', 'bob.test@example.com', '$2b$10$abcFakeHash67890', 'BobWeeb', CURRENT_TIMESTAMP),
('usr_99999klmno', 'charlie@example.com', '$2b$10$defFakeHash99999', 'CharlieManga', CURRENT_TIMESTAMP);

-- 3. Insertion des jetons d'authentification (Auth Tokens)
INSERT INTO "public"."auth_tokens" ("id", "userId", "refreshToken", "refreshExpiresAt", "userAgent", "ipAddress") VALUES 
('tok_111', 'usr_12345abcde', 'refresh_token_alice_xyz', CURRENT_TIMESTAMP + INTERVAL '7 days', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.10'),
('tok_222', 'usr_67890fghij', 'refresh_token_bob_abc', CURRENT_TIMESTAMP + INTERVAL '7 days', 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X)', '10.0.0.5');

-- 4. Insertion des œuvres (Works)
INSERT INTO "public"."works" ("id", "name", "synopsis", "imgUrl", "mangaChapter", "animeSeason", "animeEpisode") VALUES 
(1, 'One Piece', 'L''histoire de Monkey D. Luffy qui veut devenir le roi des pirates.', 'https://example.com/op.jpg', '1105', 'Season 21', '1091'),
(2, 'Jujutsu Kaisen', 'Yuji Itadori rejoint une organisation secrète d''exorcistes.', 'https://example.com/jjk.jpg', '248', 'Season 2', '23'),
(3, 'Solo Leveling', 'Dans un monde où des portails sont apparus, Jinwoo Sung évolue pour devenir le plus fort.', 'https://example.com/sl.jpg', '179', 'Season 1', '4');

-- 5. Lier les œuvres à leurs sources (Tables de liaison)
-- Manga
INSERT INTO "public"."manga_source_works" ("mangaSourceId", "workId") VALUES 
(1, 1), -- One piece sur MangaDex
(2, 1), -- One piece sur Shonen Jump+
(2, 2), -- JJK sur Shonen Jump+
(3, 3); -- Solo Leveling sur Scantrad

-- Anime
INSERT INTO "public"."anime_source_works" ("animeSourceId", "workId") VALUES 
(1, 1), -- One Piece sur Crunchyroll
(1, 2), -- JJK sur Crunchyroll
(1, 3); -- Solo Leveling sur Crunchyroll

-- 6. Insertion des alertes (Alerts)
INSERT INTO "public"."alerts" ("userId", "workId", "mangaAlert", "animeAlert") VALUES 
('usr_12345abcde', 1, true, false),  -- Alice suit le manga One Piece
('usr_12345abcde', 2, false, true),  -- Alice suit l'anime JJK
('usr_67890fghij', 3, true, true);   -- Bob suit l'anime ET le manga Solo Leveling

-- OPTIONNEL : Mise à jour des séquences (Si vous insérez des IDs manuellement dans des colonnes SERIAL, 
-- il est conseillé de mettre à jour la séquence PostgreSQL pour éviter les conflits futurs).
SELECT setval('works_id_seq', (SELECT MAX(id) FROM "public"."works"));
SELECT setval('manga_sources_id_seq', (SELECT MAX(id) FROM "public"."manga_sources"));
SELECT setval('anime_sources_id_seq', (SELECT MAX(id) FROM "public"."anime_sources"));