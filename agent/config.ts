const [, , agentHostName='localhost', agentPort='3001', serverHostName = 'localhost', serverPort='3000' ] = process.argv;

export default {
  port: agentPort,
  server: `http://${serverHostName}:${serverPort}`,
  domain: `http://${agentHostName}`,
  host: '0.0.0.0',
}