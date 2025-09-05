import axios from 'axios';
import moment from 'moment';

/**
 * Рекурсивный перебор пагинации по выбранной дате
 * @param {*} selectedDate
 * @param {*} options
 */
export default async function (selectedDate, options) {
  let url = `https://www.gosuslugi.ru/api/lk/v1/feeds/?unread=false&isArchive=false&isHide=false&types=GEPS&pageSize=15&lastFeedDate=${selectedDate}T21:59:59.000+0300`;
  let i = 0;
  let result = [];

  async function getData(url) {
    i++;

    if (i < 10) {
      const response = await axios.get(url, options);
      const items = response.data.items;

      if (items) {
        const firstItem = items[0];
        const firstItemDate = firstItem.date;
        const lastItem = items[items.length - 1];
        const lastItemId = lastItem.id;
        const lastItemDate = lastItem.date;

        if (moment(firstItemDate).format('YYYY-MM-DD') === selectedDate) {
          url = `https://www.gosuslugi.ru/api/lk/v1/feeds/?types=GEPS&pageSize=15&lastFeedDate=${lastItemDate}&lastFeedId=${lastItemId}`;
          result = result.concat(
            items.filter(
              (item) =>
                moment(item.date).format('YYYY-MM-DD') === selectedDate && item.title === 'ФССП'
            )
          );

          return getData(url);
        }
      }
    }
  }

  await getData(url);

  return result.map((item) => {
    return {
      notifyId: item.id,
      url: `https://www.gosuslugi.ru/api/lk/v1/feeds/${item.id}`,
    };
  });
}
