export function normalize<T extends object>(
  data: T[],
  key: keyof T,
  initialValue = {} as Record<string, T>
) {
  return data.reduce((acc, item) => {
    const id = item[key] as string;
    acc[id] = item;
    return acc;
  }, initialValue);
}
