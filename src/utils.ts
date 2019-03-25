export function toQueryString(obj: any) {
    const queryString = Object.keys(obj)
      .map(key => `${key}=${obj[key]}`)
      .join("&");
  
    return queryString;
  }
  