import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastify from "fastify";
import {
	jsonSchemaTransform,
	validatorCompiler,
	type ZodTypeProvider
} from "fastify-type-provider-zod";
import { serializerCompiler } from "fastify-type-provider-zod";
import { getCoursesRoute } from "./routes/get-courses";
import { getCourseById } from "./routes/get-course-by-id";
import { createCourseRoute } from "./routes/create-course";
import { loginRoute } from "./routes/login";

const server = fastify().withTypeProvider<ZodTypeProvider>();

server.setSerializerCompiler(serializerCompiler);
server.setValidatorCompiler(validatorCompiler);

// buscar por fastify scalar api reference

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Desafio Node.js",
			version: "1.0.0"
		}
	},
	transform: jsonSchemaTransform
});

server.register(fastifySwaggerUi, {
	routePrefix: "/docs"
});

server.register(getCoursesRoute);
server.register(getCourseById);
server.register(createCourseRoute);
server.register(loginRoute);

export { server };
