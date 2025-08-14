interface S3DataResponse {
  message: string;
  files: string[];
  data: CsvFiles;
}

interface S3DataErrorResponse {
  message: string;
  error: string;
}

interface CsvRow {
  [key: string]: string;
}

interface CsvFiles {
  [filename: string]: CsvRow[];
}

export type { S3DataResponse, S3DataErrorResponse, CsvRow, CsvFiles };
