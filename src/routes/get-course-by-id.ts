import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { db } from "../database/client.ts";
import { courses } from "../database/schema.ts";
import { eq } from "drizzle-orm";
import z from "zod";
import { checkRequestJWT } from "../hooks/check-request-jwt.ts";
import { checkUserRole } from "../hooks/check-user-role.ts";

export const getCourseById: FastifyPluginAsyncZod = async server => {
	server.get(
		"/courses/:id",
		{
			schema: {
				params: z.object({
					id: z.string()
				}),
				tags: ["courses"],
				summary: "Get a course by id",
				description: "This route is used to get a course by id",
				response: {
					200: z
						.object({
							course: z.object({
								id: z.string(),
								title: z.string(),
								description: z.string().nullable()
							})
						})
						.describe("Course found successfully"),
					404: z
						.object({
							message: z.string()
						})
						.describe("Course not found")
				}
			},
			preHandler: [checkRequestJWT, checkUserRole("manager")]
		},
		async (request, reply) => {
			const { id: courseId } = request.params;

			const result = await db
				.select()
				.from(courses)
				.where(eq(courses.id, courseId));

			if (result.length > 0) {
				return reply.send({
					course: result[0]
				});
			}

			return reply.status(404).send({ message: "Course not found" });
		}
	);
};
