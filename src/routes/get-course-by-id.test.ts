import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { makeCourse } from "../tests/factories/make-course";
import { makeAuthenticatedUser } from "../tests/factories/make-user";

test("get a curse by id", async () => {
	await server.ready();

	const { token } = await makeAuthenticatedUser("manager");
	const course = await makeCourse();

	const response = await request(server.server)
		.get(`/courses/${course.id}`)
		.set("Authorization", token);

	expect(response.status).toBe(200);
	expect(response.body).toEqual({
		course: {
			id: expect.any(String),
			title: expect.any(String),
			description: null
		}
	});
});

test("return 404 if course not found", async () => {
	await server.ready();

	const { token } = await makeAuthenticatedUser("manager");

	const nonExistentUuid = "123e4567-e89b-12d3-a456-426614174000";
	const response = await request(server.server)
		.get(`/courses/${nonExistentUuid}`)
		.set("Authorization", token);

	expect(response.status).toBe(404);
});
