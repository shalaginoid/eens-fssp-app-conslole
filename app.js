import sql from 'mssql';
import config from './config.js';
import moment from 'moment';
import useGetFeedsByDate from './utils/useGetFeedsByDate.js';
import useStartApp from './utils/useStartApp.js';

process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

(async () => {
  try {
    await sql.connect(config.dbConnectionString);

    const result = await sql.query('SELECT cookie FROM dbo.AccessToken WHERE id = 1');
    const cookies = result.recordset[0].cookie;

    const cookiesString = JSON.parse(cookies)
      .map((item) => `${item.name}=${item.value}`)
      .join('; ');

    const options = {
      headers: {
        Cookie: cookiesString,
      },
      maxRedirects: 0,
      validateStatus() {
        return true;
      },
    };

    // const date = moment().subtract(1, 'day').format('YYYY-MM-DD');
    const date = '2025-09-09';
    const feeds = (await useGetFeedsByDate(date, options)).filter((item) => item.notifyId === 2000007948365414);

    await useStartApp(feeds, options, cookiesString);
  } catch (error) {
    console.log(error);
  } finally {
    await sql.close();
  }
})();
