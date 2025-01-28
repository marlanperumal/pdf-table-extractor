export interface Config {
  $schema: string;
  layout: {
    default: {
      area: number[];
      columns: number[];
    };
    first?: {
      area: number[];
      columns: number[];
    };
  };
  columns: {
    [key: string]: string;
  };
  order: string[];
  cleaning: {
    numeric: string[];
    date: string[];
    date_format?: string;
    trans_detail?: string;
    dropna?: string[];
  };
}

export function toSnakeCase(str: string): string {
  return str.toLowerCase().replace(/\s+/g, "_");
}
