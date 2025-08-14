import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { makeCourse } from "../tests/factories/make-course";

test("get a curse by id", async () => {
	await server.ready();

	const course = await makeCourse();

	const response = await request(server.server).get(`/courses/${course.id}`);

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

	// Use a valid UUID format that doesn't exist in the database
	const nonExistentUuid = "123e4567-e89b-12d3-a456-426614174000";
	const response = await request(server.server).get(`/courses/${nonExistentUuid}`);

	expect(response.status).toBe(404);
});
