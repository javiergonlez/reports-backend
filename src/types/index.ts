type S3DataResponse = {
  message: string;
  files: string[];
  data: CsvFiles;
};

type S3DataErrorResponse = {
  message: string;
  error: string;
};

type CsvRow = {
  [key: string]: string;
};

type CsvFiles = {
  [filename: string]: CsvRow[];
};

export type { S3DataResponse, S3DataErrorResponse, CsvRow, CsvFiles };
