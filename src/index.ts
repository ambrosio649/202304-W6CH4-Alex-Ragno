import http from 'http';
import url from 'url';
import { program } from 'commander';
import * as dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 6555;
const version = '1.0.0';

program.option('-v, --version');
program.parse();
const options = program.opts();

if (options.version) {
  console.log('Version ' + version);
  process.exit(0);
}

const server = http.createServer((req, res) => {
  if (!req.url) {
    server.emit('error', new Error('No url in the request'));
    return;
  }

  const { pathname, query } = url.parse(req.url);

  const params = query;
  const paramArr = params!.slice(params!.indexOf('?') + 1).split('&');
  const a = paramArr[0].slice(paramArr.indexOf('='));
  const b = paramArr[1].slice(paramArr.indexOf('='));

  const addition = () => Number(a) + Number(b);
  const substraction = () => Number(a) - Number(b);
  const division = () => Number(a) / Number(b);
  const multiplication = () => Number(a) * Number(b);

  if (req.method !== 'GET') {
    server.emit('error', new Error('Invalid method'));
    return;
  }

  if (pathname !== '/calculator') {
    server.emit('error', new Error('Path not found'));
    res.write(`<h1>Error 404</h1><h2>Path not found</h2>`);
    return;
  }

  res.write(`<h1>Hola ${pathname!.toUpperCase()}</h1>`);
  res.write(`<p>a = ${a}</p>`);
  res.write(`<p>b = ${b}</p>`);

  // Res.write(req.method);
  // res.write(req.url);
  res.write(`<p>${a} + ${b} = ${addition()}</p>`);
  res.write(`<p>${a} - ${b} = ${substraction()}</p>`);
  res.write(`<p>${a} / ${b} = ${division()}</p>`);
  res.write(`<p>${a} * ${b} = ${multiplication()}</p>`);

  res.end();
});

server.listen(PORT);

server.on('listening', () => {
  console.log('Listening on port ' + PORT);
});

server.on('error', (error) => {
  console.log(error.message);
});
