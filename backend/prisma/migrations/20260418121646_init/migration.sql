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
CREATE TABLE "public"."mangas" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "synopsis" TEXT,
    "imgUrl" TEXT,
    "chapter" TEXT,

    CONSTRAINT "mangas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."animes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "synopsis" TEXT,
    "imgUrl" TEXT,
    "season" TEXT,
    "episode" TEXT,

    CONSTRAINT "animes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manga_alerts" (
    "userId" TEXT NOT NULL,
    "mangaId" INTEGER NOT NULL,

    CONSTRAINT "manga_alerts_pkey" PRIMARY KEY ("userId","mangaId")
);

-- CreateTable
CREATE TABLE "public"."anime_alerts" (
    "userId" TEXT NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "anime_alerts_pkey" PRIMARY KEY ("userId","animeId")
);

-- CreateTable
CREATE TABLE "public"."global_manga_sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domainUrl" TEXT NOT NULL,

    CONSTRAINT "global_manga_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."global_anime_sources" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "domainUrl" TEXT NOT NULL,

    CONSTRAINT "global_anime_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."manga_sources" (
    "link" TEXT NOT NULL DEFAULT '',
    "globalMangaSourceId" INTEGER NOT NULL,
    "mangaId" INTEGER NOT NULL,

    CONSTRAINT "manga_sources_pkey" PRIMARY KEY ("globalMangaSourceId","mangaId")
);

-- CreateTable
CREATE TABLE "public"."anime_sources" (
    "link" TEXT NOT NULL DEFAULT '',
    "globalAnimeSourceId" INTEGER NOT NULL,
    "animeId" INTEGER NOT NULL,

    CONSTRAINT "anime_sources_pkey" PRIMARY KEY ("globalAnimeSourceId","animeId")
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
ALTER TABLE "public"."manga_alerts" ADD CONSTRAINT "manga_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manga_alerts" ADD CONSTRAINT "manga_alerts_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "public"."mangas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anime_alerts" ADD CONSTRAINT "anime_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anime_alerts" ADD CONSTRAINT "anime_alerts_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manga_sources" ADD CONSTRAINT "manga_sources_globalMangaSourceId_fkey" FOREIGN KEY ("globalMangaSourceId") REFERENCES "public"."global_manga_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manga_sources" ADD CONSTRAINT "manga_sources_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "public"."mangas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anime_sources" ADD CONSTRAINT "anime_sources_globalAnimeSourceId_fkey" FOREIGN KEY ("globalAnimeSourceId") REFERENCES "public"."global_anime_sources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anime_sources" ADD CONSTRAINT "anime_sources_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
