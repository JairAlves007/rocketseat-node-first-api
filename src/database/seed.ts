import { hash } from "argon2";
import { db } from "./client";
import { courses, enrollments, users } from "./schema";
import { fakerPT_BR as faker } from "@faker-js/faker";

async function seed() {
	const passwordHash = await hash("123456");

	const userInsert = await db
		.insert(users)
		.values([
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: passwordHash,
				role: "student"
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: passwordHash,
				role: "student"
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: passwordHash,
				role: "student"
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: passwordHash,
				role: "student"
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: passwordHash,
				role: "student"
			},
			{
				name: faker.person.fullName(),
				email: faker.internet.email(),
				password: passwordHash,
				role: "student"
			}
		])
		.returning();

	const courseInsert = await db
		.insert(courses)
		.values([
			{
				title: faker.lorem.words(4),
				description: faker.lorem.sentence()
			},
			{
				title: faker.lorem.words(4),
				description: faker.lorem.sentence()
			},
			{
				title: faker.lorem.words(4),
				description: faker.lorem.sentence()
			}
		])
		.returning();

	await db.insert(enrollments).values([
		{
			userId: userInsert[0].id,
			courseId: courseInsert[0].id
		},
		{
			userId: userInsert[0].id,
			courseId: courseInsert[1].id
		},
		{
			userId: userInsert[0].id,
			courseId: courseInsert[2].id
		},
		{
			userId: userInsert[1].id,
			courseId: courseInsert[0].id
		},
		{
			userId: userInsert[1].id,
			courseId: courseInsert[1].id
		},
		{
			userId: userInsert[1].id,
			courseId: courseInsert[2].id
		}
	]);
}

seed();
