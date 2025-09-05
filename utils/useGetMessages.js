export default async function (notifications) {
  const messages = notifications.reduce((acc, item) => {
    acc.push(
      ...item.detail.messages.map((message) => {
        return {
          notifyID: item.id,
          notifyDate: item.date,
          ...message,
        };
      })
    );

    return acc;
  }, []);

  return messages;
}
