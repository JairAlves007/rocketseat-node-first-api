import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client.ts";
import { users } from "../database/schema.ts";
import { eq } from "drizzle-orm";
import { verify } from "argon2";
import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
	throw new Error("JWT_SECRET is not defined");
}

export const loginRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		"/sessions",
		{
			schema: {
				tags: ["auth"],
				summary: "Login",
				description: "This route is used to login",
				body: z.object({
					email: z.email(),
					password: z.string()
				}),
				response: {
					200: z
						.object({
							token: z.string()
						})
						.describe("Login successfully"),
					400: z
						.object({
							message: z.string()
						})
						.describe("Invalid credentials")
				}
			}
		},
		async (request, reply) => {
			const { email, password } = request.body;

			const result = await db
				.select()
				.from(users)
				.where(eq(users.email, email));

			if (result.length <= 0) {
				return reply.status(400).send({
					message: "Credenciais inválidas"
				});
			}

			const user = result[0];

			const doesPasswordMatch = await verify(user.password, password);

			if (!doesPasswordMatch) {
				return reply.status(400).send({
					message: "Credenciais inválidas"
				});
			}

			const token = jwt.sign(
				{
					sub: user.id,
					role: user.role
				},
				process.env.JWT_SECRET!
			);

			return reply.status(200).send({ token });
		}
	);
};
