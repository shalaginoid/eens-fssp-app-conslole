import axios from 'axios';

export default async function (data, cookiesString) {
  let result = [];

  for (const item of data) {
    try {
      console.log('download pdf: ', item.url);

      const response = await axios.get(item.url, {
        headers: {
          Cookie: cookiesString,
        },
        responseType: 'arraybuffer',
      });

      if (response.status === 200) {
        const base64 = Buffer.from(response.data, 'binary').toString('base64');

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
          data: base64,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  return result;
}

// export default async function (data, cookiesString) {
//   const promises = data.map((data) =>
//     axios.get(data.url, {
//       headers: {
//         Cookie: cookiesString,
//       },
//       responseType: 'arraybuffer',
//       data: data,
//     })
//   );

//   const result = await Promise.allSettled(promises).then((res) =>
//     res
//       .filter((response) => response.status === 'fulfilled')
//       .map((response) => {
//         try {
//           const buffer = response.value.data;
//           const base64 = Buffer.from(buffer, 'binary').toString('base64');
//           const item = JSON.parse(response.value.config.data);

//           return {
//             fileName: item.fileName,
//             fileSize: item.fileSize,
//             messageId: item.messageId,
//             notifyID: item.notifyID,
//             notifyDate: item.notifyDate,
//             attachmentId: item.attachmentId,
//             mimeType: item.mimeType,
//             parentId: item.parentId,
//             status: item.status,
//             data: base64,
//           };
//         } catch (error) {
//           console.log(error.message);
//         }
//       })
//   );

//   return result;
// }
