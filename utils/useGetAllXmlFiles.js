import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export default async function (data, cookiesString) {
  const parser = new XMLParser();

  let result = [];

  for (const item of data) {
    try {
      console.log('download xml: ', item.url);

      const response = await axios.get(item.url, {
        headers: {
          Cookie: cookiesString,
        },
        responseType: 'arraybuffer',
      });

      if (response.status === 200) {
        const xml = parser.parse(response.data)['fssp:OIp'];

        result.push({
          fileName: item.fileName,
          fileSize: item.fileSize,
          messageId: item.messageId,
          notifyID: item.notifyID,
          notifyDate: item.notifyDate,
          attachmentId: item.attachmentId,
          mimeType: item.mimeType,
          parentId: item.parentId,
          status: item.status,
          data: xml,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return result;
}

// export default async function (data, cookiesString) {
//   const parser = new XMLParser();

//   const promises = data.map((data) => {
//     return axios.get(data.url, {
//       headers: {
//         Cookie: cookiesString,
//       },
//       responseType: 'arraybuffer',
//     });
//   });

//   const result = await Promise.allSettled(promises).then((res) => {
//     return res
//       .filter((response) => response.status === 'fulfilled')
//       .map((response) => {
//         const buffer = response.value.data;
//         const xml = parser.parse(buffer);
//         console.log(xml['fssp:OIp']);
//       });
//   });

//   return result;
// }
