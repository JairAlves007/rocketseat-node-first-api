import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuthUserFromRequest } from "../utils/get-auth-user-from-request.ts";

type JWTPayload = {
	sub: string;
	role: "student" | "manager";
};

export function checkUserRole(role: "student" | "manager") {
	return async (request: FastifyRequest, reply: FastifyReply) => {
		const user = getAuthUserFromRequest(request);

		if (user.role !== role) {
			return reply.status(401).send({ message: "Unauthorized" });
		}
	};
}
