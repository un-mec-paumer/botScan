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
-- CREATE TABLE "public"."works" (
--     "id" SERIAL NOT NULL,
--     "name" TEXT NOT NULL,
--     "synopsis" TEXT,
--     "imgUrl" TEXT,
--     -- "mangaSource" TEXT,
--     "mangaChapter" TEXT,
--     -- "animeSource" TEXT,
--     "animeSeason" TEXT,
--     "animeEpisode" TEXT,

--     CONSTRAINT "works_pkey" PRIMARY KEY ("id")

-- );

-- CreateTable
CREATE TABLE "public"."manga" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "synopsis" TEXT,
    "imgUrl" TEXT,
    "mangaChapter" TEXT,
    -- "mangaSource" TEXT,
    -- "language" TEXT,

    CONSTRAINT "manga_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."anime" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "synopsis" TEXT,
    "imgUrl" TEXT,
    "animeSeason" TEXT,
    "animeEpisode" TEXT,
    -- "language" TEXT,

    CONSTRAINT "anime_pkey" PRIMARY KEY ("id")
);




CREATE TABLE "public"."manga_sources" (
    "id" INT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "manga_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."anime_sources" (
    "id" INT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "anime_sources_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "public"."manga_source_works" (
    "mangaSourceId" INTEGER NOT NULL,
    "mangaId" INTEGER NOT NULL,

    CONSTRAINT "manga_source_works_pkey" PRIMARY KEY ("mangaSourceId", "mangaId")
);

CREATE TABLE "public"."anime_source_works" (
    "animeSourceId" INTEGER NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "anime_source_works_pkey" PRIMARY KEY ("animeSourceId", "animeId")
);

-- CreateTable
-- CREATE TABLE "public"."alerts" (
--     "userId" TEXT NOT NULL,
--     "workId" INTEGER NOT NULL,
--     "mangaAlert" BOOLEAN NOT NULL DEFAULT false,
--     "animeAlert" BOOLEAN NOT NULL DEFAULT false,

--     CONSTRAINT "alerts_pkey" PRIMARY KEY ("userId","workId")
-- );

CREATE TABLE "public"."manga_alerts" (
    "userId" TEXT NOT NULL,
    "mangaId" INT NOT NULL,

    CONSTRAINT "manga_alerts_pkey" PRIMARY KEY ("userId", "mangaId")
);

CREATE TABLE "public"."anime_alerts" (
    "userId" TEXT NOT NULL,
    "animeId" INT NOT NULL,

    CONSTRAINT "anime_alerts_pkey" PRIMARY KEY ("userId", "animeId")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_refreshToken_key" ON "public"."auth_tokens"("refreshToken");

-- AddForeignKey
ALTER TABLE "public"."auth_tokens" ADD CONSTRAINT "auth_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey MangaAlert
ALTER TABLE "public"."manga_alerts" ADD CONSTRAINT "manga_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."manga_alerts" ADD CONSTRAINT "manga_alerts_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "public"."manga"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."anime_alerts" ADD CONSTRAINT "anime_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "public"."anime_alerts" ADD CONSTRAINT "anime_alerts_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manga_source_works" ADD CONSTRAINT "manga_source_works_mangaSourceId_fkey" FOREIGN KEY ("mangaSourceId") REFERENCES "public"."manga_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."manga_source_works" ADD CONSTRAINT "manga_source_works_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "public"."manga"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- AddForeignKey
ALTER TABLE "public"."anime_source_works" ADD CONSTRAINT "anime_source_works_animeSourceId_fkey" FOREIGN KEY ("animeSourceId") REFERENCES "public"."anime_sources"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "public"."anime_source_works" ADD CONSTRAINT "anime_source_works_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."anime"("id") ON DELETE CASCADE ON UPDATE CASCADE;


-- 1. Insertion des sources (Manga & Anime)
INSERT INTO "public"."manga_sources" ("id", "name", "url") VALUES 
(1, 'MangaDex', 'https://mangadex.org/'),
(2, 'Shonen Jump+', 'https://www.jumplus.com/'),
(3, 'Scantrad France', 'https://scantrad.net/');

INSERT INTO "public"."anime_sources" ("id", "name", "url") VALUES 
(1, 'Crunchyroll', 'https://www.crunchyroll.com/'),
(2, 'Netflix', 'https://www.netflix.com/'),
(3, 'Animation Digital Network (ADN)', 'https://www.adn.com/');

-- 2. Insertion des utilisateurs
INSERT INTO "public"."users" ("id", "email", "passwordHash", "username", "updatedAt") VALUES 
('usr_11111aaaaa', 'naruto.uzumaki@example.com', '$2b$10$fakeHash1234567890abcd', 'Hokage7', CURRENT_TIMESTAMP),
('usr_22222bbbbb', 'frieren@example.com', '$2b$10$fakeHash0987654321dcba', 'ElfMage', CURRENT_TIMESTAMP),
('usr_33333ccccc', 'guts.black@example.com', '$2b$10$fakeHash11223344556677', 'BlackSwordsman', CURRENT_TIMESTAMP);

-- 3. Insertion des jetons d'authentification (Auth Tokens)
INSERT INTO "public"."auth_tokens" ("id", "userId", "refreshToken", "refreshExpiresAt", "userAgent", "ipAddress") VALUES 
('tok_abc123', 'usr_11111aaaaa', 'refresh_token_naruto_123', CURRENT_TIMESTAMP + INTERVAL '7 days', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', '192.168.1.15'),
('tok_def456', 'usr_22222bbbbb', 'refresh_token_frieren_456', CURRENT_TIMESTAMP + INTERVAL '7 days', 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)', '10.0.0.42');

-- 4. Insertion des Mangas
INSERT INTO "public"."manga" ("id", "name", "synopsis", "imgUrl", "mangaChapter") VALUES 
(1, 'One Piece', 'L''histoire de Monkey D. Luffy qui veut devenir le roi des pirates.', 'https://example.com/manga/op.jpg', '1111'),
(2, 'Berserk', 'Guts, le guerrier noir, erre dans un monde cauchemardesque.', 'https://example.com/manga/berserk.jpg', '375'),
(3, 'Jujutsu Kaisen', 'Yuji Itadori rejoint une organisation secrète d''exorcistes.', 'https://example.com/manga/jjk.jpg', '255');

-- 5. Insertion des Animes
INSERT INTO "public"."anime" ("id", "name", "synopsis", "imgUrl", "animeSeason", "animeEpisode") VALUES 
(1, 'One Piece', 'L''histoire de Monkey D. Luffy qui veut devenir le roi des pirates.', 'https://example.com/anime/op.jpg', 'Season 21', '1095'),
(2, 'Frieren', 'Le voyage de l''elfe Frieren après la défaite du roi des démons.', 'https://example.com/anime/frieren.jpg', 'Season 1', '28'),
(3, 'L''Attaque des Titans', 'L''humanité vit retranchée dans une ville entourée d''immenses murs.', 'https://example.com/anime/aot.jpg', 'Season 4', '89');

-- 6. Lier les mangas à leurs sources
INSERT INTO "public"."manga_source_works" ("mangaSourceId", "mangaId") VALUES 
(1, 1), -- One Piece sur MangaDex
(2, 1), -- One Piece sur Shonen Jump+
(3, 2), -- Berserk sur Scantrad France
(2, 3); -- JJK sur Shonen Jump+

-- 7. Lier les animes à leurs sources
INSERT INTO "public"."anime_source_works" ("animeSourceId", "animeId") VALUES 
(1, 1), -- One Piece sur Crunchyroll
(1, 2), -- Frieren sur Crunchyroll
(1, 3), -- AOT sur Crunchyroll
(3, 1); -- One Piece sur ADN

-- 8. Insertion des alertes (Mangas)
INSERT INTO "public"."manga_alerts" ("userId", "mangaId") VALUES 
('usr_11111aaaaa', 1), -- Naruto suit le manga One Piece
('usr_33333ccccc', 2); -- Guts suit le manga Berserk

-- 9. Insertion des alertes (Animes)
INSERT INTO "public"."anime_alerts" ("userId", "animeId") VALUES 
('usr_11111aaaaa', 1), -- Naruto suit aussi l'anime One Piece
('usr_22222bbbbb', 2), -- Frieren suit l'anime Frieren
('usr_33333ccccc', 3); -- Guts suit l'anime AOT

-- 10. Mise à jour des séquences (Important pour les colonnes SERIAL)
SELECT setval('manga_id_seq', (SELECT MAX(id) FROM "public"."manga"));
SELECT setval('anime_id_seq', (SELECT MAX(id) FROM "public"."anime"));