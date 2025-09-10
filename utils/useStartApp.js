import sql from 'mssql';
import useGetMessages from './useGetMessages.js';
import useGetAttachments from './useGetAttachments.js';
import useGetNotifications from './useGetNotifications.js';
import useGetAllXmlFiles from './useGetAllXmlFiles.js';
import useGetAllPdfFiles from './useGetAllPdfFiles.js';

export default async function (feeds, options, cookiesString) {
  const notifications = await useGetNotifications(feeds, options);
  const messages = await useGetMessages(notifications);
  const attachments = await useGetAttachments(messages);

  // Получаем все xml-файлы и добавляем URL-адреса
  const xmlFiles = attachments
    .filter((item) => item.mimeType === 'application/xml' && item.status === 'READY' && item.eds === 'OK')
    .map((item) => ({
      ...item,
      url: `https://www.gosuslugi.ru/api/lk/geps/file/download/${item.attachmentId}?inline=false`,
    }));

  // Получаем все pdf-файлы и добавляем URL-адреса
  const pdfFiles = attachments
    .filter((item) => item.mimeType === 'application/pdf' && item.status === 'READY')
    .map((item) => ({
      ...item,
      url: `https://www.gosuslugi.ru/api/lk/geps/file/download/${item.attachmentId}?inline=false`,
    }));

  const loadedXmlFiles = await useGetAllXmlFiles(xmlFiles, cookiesString);
  const loadedPdfFiles = await useGetAllPdfFiles(pdfFiles, cookiesString);

  // Записываем сообщения в БД
  for await (const xml of loadedXmlFiles) {
    try {
      console.log(xml.messageId);

      const query = `INSERT INTO dbo.Messages (messageId, data, notifyId, notifyDate) VALUES ('${
        xml.messageId
      }', '${JSON.stringify(xml)}', ${xml.notifyID}, '${xml.notifyDate}')`;

      await sql.query(query);
    } catch (error) {
      console.log(error.message);
    }
  }

  // Записываем файлы в БД
  // const sqlDataPdf = loadedPdfFiles.map((item) => {
  //   return {
  //     fileName: item.fileName,
  //     fileSize: item.fileSize,
  //     messageId: item.messageId,
  //     attachmentId: item.attachmentId,
  //     mimeType: item.mimeType,
  //     parentId: item.parentId,
  //     status: item.status,
  //     data: item.data,
  //   };
  // });

  // Записываем файлы в БД
  for await (const mess of loadedPdfFiles) {
    try {
      const query = `
        INSERT INTO dbo.Files (messageId, fileName, fileSize, attachmentId, mimeType, parentId, status, attachment)
        values (
          '${mess.messageId}',
          '${mess.fileName}',
          '${mess.fileSize}',
          '${mess.attachmentId}',
          '${mess.mimeType}',
          '${mess.parentId}',
          '${mess.status}',
          '${mess.data}'
        )
      `;
      await sql.query(query);
    } catch (error) {
      console.log(error.message);
    }
  }
}
