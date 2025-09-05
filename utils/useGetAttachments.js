export default async function (messages) {
  const attachments = messages.reduce((acc, item) => {
    acc.push(
      ...item.attachments.map((attachment) => {
        return {
          notifyID: item.notifyID,
          notifyDate: item.notifyDate,
          ...attachment,
        };
      })
    );
    return acc;
  }, []);

  return attachments;
}
