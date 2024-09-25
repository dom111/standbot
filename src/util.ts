export const bisect = <T = any>(
  array: T[],
  bisector: (item: T) => boolean,
): [T[], T[]] =>
  array.reduce(
    ([positives, negatives], item) => {
      if (bisector(item)) {
        positives.push(item);
      } else {
        negatives.push(item);
      }

      return [positives, negatives];
    },
    [[], []],
  );

export const joinList = (array: any[]) => {
  const formatter = new Intl.ListFormat("en", {
    style: "long",
  });

  return formatter.format(array);
};

export const dayOfWeek = (date: Date) => {
  const dateFormatter = new Intl.DateTimeFormat("en", { weekday: "long" }),
    [{ value: day }] = dateFormatter.formatToParts(date);

  return day;
};
