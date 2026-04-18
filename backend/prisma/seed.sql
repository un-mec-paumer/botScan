-- 1. Insertion des sources (Manga & Anime)
INSERT INTO "public"."global_manga_sources" ("id", "name", "domainUrl") VALUES 
(1, 'MangaDex', 'https://mangadex.org/'),
(2, 'Shonen Jump+', 'https://www.jumplus.com/'),
(3, 'Scantrad France', 'https://scantrad.net/');

INSERT INTO "public"."global_anime_sources" ("id", "name", "domainUrl") VALUES 
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
INSERT INTO "public"."mangas" ("id", "name", "synopsis", "imgUrl", "chapter") VALUES 
(1, 'One Piece', 'L''histoire de Monkey D. Luffy qui veut devenir le roi des pirates.', 'https://example.com/manga/op.jpg', '1111'),
(2, 'Berserk', 'Guts, le guerrier noir, erre dans un monde cauchemardesque.', 'https://example.com/manga/berserk.jpg', '375'),
(3, 'Jujutsu Kaisen', 'Yuji Itadori rejoint une organisation secrète d''exorcistes.', 'https://example.com/manga/jjk.jpg', '255');

-- 5. Insertion des Animes
INSERT INTO "public"."animes" ("id", "name", "synopsis", "imgUrl", "season", "episode") VALUES 
(1, 'One Piece', 'L''histoire de Monkey D. Luffy qui veut devenir le roi des pirates.', 'https://example.com/anime/op.jpg', 'Season 21', '1095'),
(2, 'Frieren', 'Le voyage de l''elfe Frieren après la défaite du roi des démons.', 'https://example.com/anime/frieren.jpg', 'Season 1', '28'),
(3, 'L''Attaque des Titans', 'L''humanité vit retranchée dans une ville entourée d''immenses murs.', 'https://example.com/anime/aot.jpg', 'Season 4', '89');

-- 6. Lier les mangas à leurs sources
INSERT INTO "public"."manga_sources" ("globalMangaSourceId", "mangaId") VALUES 
(1, 1), -- One Piece sur MangaDex
(2, 1), -- One Piece sur Shonen Jump+
(3, 2), -- Berserk sur Scantrad France
(2, 3); -- JJK sur Shonen Jump+

-- 7. Lier les animes à leurs sources
INSERT INTO "public"."anime_sources" ("globalAnimeSourceId", "animeId") VALUES 
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
--SELECT setval('manga_id_seq', (SELECT MAX(id) FROM "public"."mangas"));
--SELECT setval('anime_id_seq', (SELECT MAX(id) FROM "public"."animes"));
