import axios from 'axios';
import { XMLParser } from 'fast-xml-parser';

export default async function (data, cookiesString) {
  const promises = data.map((data) => {
    return axios.get(data.url, {
      headers: {
        Cookie: cookiesString,
      },
      responseType: 'arraybuffer',
      data: data,
    });
  });

  const parser = new XMLParser();

  const result = await Promise.allSettled(promises).then((res) => {
    return res
      .filter((response) => response.status === 'fulfilled')
      .map((response) => {
        const item = JSON.parse(response.value.config.data);
        console.log(item);

        return {
          fileName: item.fileName,
          fileSize: item.fileSize,
          messageId: item.messageId,
          notifyID: item.notifyID,
          notifyDate: item.notifyDate,
          attachmentId: item.attachmentId,
          mimeType: item.mimeType,
          parentId: item.parentId,
          status: item.status,
          data: parser.parse(response.value.data)['fssp:OIp'],
        };
      });
  });

  return result;
}
