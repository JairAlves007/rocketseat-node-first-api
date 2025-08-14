import { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../database/client";
import { courses } from "../database/schema";
import { checkRequestJWT } from "../hooks/check-request-jwt";
import { checkUserRole } from "../hooks/check-user-role";

export const createCourseRoute: FastifyPluginAsyncZod = async server => {
	server.post(
		"/courses",
		{
			schema: {
				tags: ["courses"],
				summary: "Create a new course",
				description: "This route is used to create a new course",
				body: z.object({
					title: z.string().min(3, "Title must be at least 3 characters long"),
					description: z.string().optional()
				}),
				response: {
					201: z
						.object({
							courseId: z.string()
						})
						.describe("Course created successfully"),
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
			const { title, description } = request.body;

			const result = await db
				.insert(courses)
				.values({
					title,
					description
				})
				.returning();

			if (result.length > 0) {
				return reply.status(201).send({
					courseId: result[0].id
				});
			}

			return reply.status(404).send({ message: "Course not found" });
		}
	);
};
