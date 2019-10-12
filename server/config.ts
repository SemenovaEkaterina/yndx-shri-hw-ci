const [, , host='localhost', port='3000', repo='' ] = process.argv;

export default {
  port,
  host,
  repo,
  timeout: "500",
  db: './database.sqlite',
}



