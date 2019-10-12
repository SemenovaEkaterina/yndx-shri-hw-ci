import callServer from './callServer';

const util = require('util');
const execFile = util.promisify(require('child_process').execFile);

export default async (id: number, repo: string, hash: string, command: string) => {
  // Имитация сборки
  const body = {id, status: 0, stdout: '', stderr: ''};
  try {
    const {stdout, stderr} = await execFile('./build.sh', [repo, hash, command], {cwd: __dirname});
    body.stdout = stdout;
    body.stderr = stderr;

  } catch (e) {
    body.status = 1;
    body.stderr = e.toString();
  }

  await callServer('/notify_build_result', body);
};