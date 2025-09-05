import axios from 'axios';

export default async function (feeds, options) {
  const urls = feeds.map(({ url }) => url);
  const promises = urls.map((url) => axios.get(url, options));
  const responses = await Promise.all(promises);

  return responses.map((response) => ({
    ...response.data,
  }));
}
