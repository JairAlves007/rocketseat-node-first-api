import type { FastifyRequest } from "fastify";

export const getAuthUserFromRequest = (request: FastifyRequest) => {
	const user = request.user;

	if (!user) {
		throw new Error("User not found in request");
	}

	return user;
};
