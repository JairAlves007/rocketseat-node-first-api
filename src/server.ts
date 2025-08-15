import { server } from "./app.ts";

server
	.listen({
		port: 3000,
		host: "0.0.0.0"
	})
	.then(() => console.log("Server running"));
