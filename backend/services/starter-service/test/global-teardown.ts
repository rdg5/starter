import dockerCompose from 'docker-compose';
import path from 'path';

export default async () => {
  await dockerCompose.down({ cwd: path.join(__dirname), log: true });
  // eslint-disable-next-line no-console
  console.log('TEARDOWNdsadsadasdsadas');
};
