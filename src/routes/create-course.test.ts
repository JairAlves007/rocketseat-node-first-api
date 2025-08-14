import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { fakerPT_BR as faker } from "@faker-js/faker";
import { makeAuthenticatedUser } from "../tests/factories/make-user";

test("create a curse", async () => {
	await server.ready();

	const { token } = await makeAuthenticatedUser("manager");
	const response = await request(server.server)
		.post("/courses")
		.set("Authorization", token)
		.set("Content-Type", "application/json")
		.send({
			title: faker.lorem.words(4)
		});

	expect(response.status).toBe(201);
	expect(response.body).toEqual({
		courseId: expect.any(String)
	});
});
