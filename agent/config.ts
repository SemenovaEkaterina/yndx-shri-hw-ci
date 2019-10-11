const [, , port] = process.argv;

export default {
  server: "localhost:3000",
  port: port || "3001"
}