const [, , port] = process.argv;

export default {
  server: "http://localhost:3000",
  port: port || "3001",
  host: 'http://localhost',
}