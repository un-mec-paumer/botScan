-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
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

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."mangas" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "chapter" TEXT NOT NULL,
    "workId" INTEGER NOT NULL,

    CONSTRAINT "mangas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."animes" (
    "id" SERIAL NOT NULL,
    "source" TEXT NOT NULL,
    "season" TEXT NOT NULL,
    "episode" TEXT NOT NULL,
    "workId" INTEGER NOT NULL,

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

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "public"."users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "auth_tokens_refreshToken_key" ON "public"."auth_tokens"("refreshToken");

-- AddForeignKey
ALTER TABLE "public"."auth_tokens" ADD CONSTRAINT "auth_tokens_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."mangas" ADD CONSTRAINT "mangas_workId_fkey" FOREIGN KEY ("workId") REFERENCES "public"."works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."animes" ADD CONSTRAINT "animes_workId_fkey" FOREIGN KEY ("workId") REFERENCES "public"."works"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manga_alerts" ADD CONSTRAINT "manga_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."manga_alerts" ADD CONSTRAINT "manga_alerts_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "public"."mangas"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anime_alerts" ADD CONSTRAINT "anime_alerts_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."anime_alerts" ADD CONSTRAINT "anime_alerts_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "public"."animes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
