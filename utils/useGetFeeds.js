import axios from 'axios';
import moment from 'moment';

export default async function (pages, options, date) {
  let result = [];

  for await (const page of pages) {
    const res = await axios.get(page, options);

    for await (const item of res.data.items) {
      if (moment(item.date).format('YYYY-MM-DD') === date) {
        result.push(item);
      }
    }
  }

  return result;
}
