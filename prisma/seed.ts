import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function seedUsers() {
  const data = [
		{ user_id: 'user_1', name_user: 'John Doe', pp: 'https://example.com/john.png' },
		{ user_id: 'user_2', name_user: 'Jane Smith', pp: 'https://example.com/jane.png' },
	]

	const users: any[] = [];

	for(const toFetch of data) {
		const user = prisma.user.create({data: toFetch});
		users.push(user);
	}

	const response = await Promise.all(users);
  console.log(`Seeded ${response.length} users`);
	return response;
}

async function seedSeries() {
  const data = [
		{
		  series_name: 'one-piece',
		  series_image: 'https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/one-piece.jpg',
		  series_synopsis: "Il fut un temps où Gold Roger était le plus grand de tous les pirates, le \"Roi des Pirates\" était son surnom. A sa mort, son trésor d'une valeur inestimable connu sous le nom de \"One Piece\" fut caché quelque part sur \"Grand Line\". De nombreux pirates sont partis à la recherche de ce trésor mais tous sont morts avant même de l'atteindre. Monkey D. Luffy rêve de retrouver ce trésor légendaire et de devenir le nouveau \"Roi des Pirates\". Après avoir mangé un fruit du démon, il possède un pouvoir lui permettant de réaliser son rêve. Il lui faut maintenant trouver un équipage pour partir à l'aventure !",
		},
		{
		  series_name: 'hazbin-hotel',
		  series_image: 'https://cdn.statically.io/gh/Anime-Sama/IMG/img/contenu/hazbin-hotel.jpg',
		  series_synopsis: "Suivez Charlie Morningstar, une démone princesse des enfers, dans sa quête pour gérer un hôtel dans le but d’offrir la possibilité de rédemption des damnés afin d'éviter leur massacre annuel à cause de leur surpopulation. Dans sa tâche elle est soutenue par sa compagne Vaggie ainsi que son premier pensionnaire Angel Dust. Elle est rejoint par un puissant démon, aux objectifs obscurs, du nom d'Alastor qui a aussi convié deux employés supplémentaire : Niffty une femme de chambre maniaque et Husk le barman taciturne.",
		},
	]

	const seriess: any[] = [];

	for(const toFetch of data) {
		const series = prisma.series.create({data: toFetch});
		seriess.push(series);
	}

	const response = await Promise.all(seriess);
  console.log(`Seeded ${response.length} series`);
	return response;
}

async function seedMedias() {
	const data = [
		{
			media_name: 'Manga',
			media_base_link: 'scan',
		},
		{
			media_name: 'Anime',
			media_base_link: 'saison',
		},
		{
			media_name: 'Movie',
			media_base_link: 'film',
		},
		{
			media_name: 'OAV',
			media_base_link: 'oav',
		},
	]

	const medias: any[] = [];

	for(const toFetch of data) {
		const media = prisma.media.create({data: toFetch});
		medias.push(media);
	}

	const response = await Promise.all(medias);
  console.log(`Seeded ${response.length} medias`);
	return response;
}

async function seedMediaSeries(medias: any[], series: any[]) {
  const data = [
		{
			media_id: medias[0].media_id,
			series_id: series[0].series_id,
			additional_link_media_series: '_noir-et-blanc',
			media_chapter: 1095.0,
			media: { connect: { media_id: medias[0].media_id } },
			series: { connect: { series_id: series[0].series_id } },
		},
		{
			media_id: medias[1].media_id,
			series_id: series[1].series_id,
			additional_link_media_series: '',
			media_chapter: 8.0,
			media: { connect: { media_id: medias[1].media_id } },
			series: { connect: { series_id: series[1].series_id } },
		},
	]

	const mediaSeriess: any[] = [];

	for(const toFetch of data) {
		const mediaSeries = prisma.mediaSeries.create({data: toFetch});
		mediaSeriess.push(mediaSeries);
	}

	const response = await Promise.all(mediaSeriess);
  console.log(`Seeded ${response.length} mediaSeries`);
	return response;
}

async function seedAlerts(mediaSeries: any[], users: any[]) {
  const data = [
		{
			media_series_id: mediaSeries[0].media_series_id,
			user_id: users[0].user_id,
		},
		{
			media_series_id: mediaSeries[1].media_series_id,
			user_id: users[1].user_id,
		},
	]

	const alerts: any[] = [];

	for(const toFetch of data) {
		const alert = prisma.alert.create({data: toFetch});
		alerts.push(alert);
	}

	const response = await Promise.all(alerts);
  console.log(`Seeded ${response.length} alerts`);
	return response;
}

async function main() {
  try {
    const users = await seedUsers();
    const medias = await seedMedias();
    const series = await seedSeries();
    const mediaSeries = await seedMediaSeries(medias, series);
    await seedAlerts(mediaSeries, users);
    console.log('✅ Database seeding complete!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
