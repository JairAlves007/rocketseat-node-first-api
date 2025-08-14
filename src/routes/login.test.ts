import { expect, test } from "vitest";
import request from "supertest";
import { server } from "../app";
import { makeUser } from "../tests/factories/make-user";

test("authenticate user", async () => {
	await server.ready();

	const { user, password } = await makeUser();

	const response = await request(server.server)
		.post("/sessions")
		.set("Content-Type", "application/json")
		.send({
			email: user.email,
			password
		});

	expect(response.status).toBe(200);
	expect(response.body).toEqual({
		token: expect.any(String)
	});
});
