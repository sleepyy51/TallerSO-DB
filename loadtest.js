import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '10s',
};

const baseUrl = __ENV.API_URL || 'http://api:8080/api';

export default function () {
  const responses = http.batch([
    ['GET', `${baseUrl}/health`],
    ['GET', `${baseUrl}/users`],
    ['GET', `${baseUrl}/authors`],
    ['GET', `${baseUrl}/books`],
    ['GET', `${baseUrl}/loans`],
  ]);

  responses.forEach((response) => {
    check(response, {
      'status is 2xx': (res) => res.status >= 200 && res.status < 300,
    });
  });

  sleep(1);
}
