export const snakeToCamel = (str: string): string => {
  return str.replace(/(_\w)/g, (match) => match[1].toUpperCase());
};

export const transformKeysToCamelCase = (data: any): any => {
  if (Array.isArray(data)) {
    return data.map((item) => transformKeysToCamelCase(item));
  }

  if (data && typeof data === 'object') {
    const newObj: any = {};
    for (const key in data) {
      const newKey = snakeToCamel(key);
      newObj[newKey] = transformKeysToCamelCase(data[key]);
    }
    return newObj;
  }

  return data;
};
