import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { makeCourse } from "../tests/factories/make-course";
import { randomUUID } from "node:crypto";

test("get a curse by id", async () => {
	await server.ready();

	const titleId = randomUUID();
	const course = await makeCourse(titleId);

	const response = await request(server.server).get(
		`/courses?search=${titleId}`
	);

	expect(response.status).toBe(200);
	expect(response.body).toEqual({
		total: 1,
		courses: [
			{
				id: expect.any(String),
				title: titleId,
				description: null,
				enrollments: 0
			}
		]
	});
});
