//------------------------------------------------------------------------------------------------------------------------------------

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
  _Object,
  ListObjectsV2CommandOutput,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import type { CsvFiles, CsvRow } from 'src/types';

//------------------------------------------------------------------------------------------------------------------------------------

@Injectable()
class S3Service {
  private s3Client: S3Client;
  private bucketName: string;
  private prefix: string;

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.getOrThrow<string>('AWS_S3_ACCESS_KEY'),
        secretAccessKey:
          this.configService.getOrThrow<string>('AWS_S3_SECRET_KEY'),
      },
    });

    const bucketConfig: string =
      this.configService.getOrThrow<string>('AWS_S3_BUCKET_NAME');
    this.bucketName = bucketConfig.replace('s3://', '').split('/')[0] || '';
    this.prefix = bucketConfig.replace(`s3://${this.bucketName}/`, '');
  }

  async loadAllCsvsFromS3(): Promise<CsvFiles> {
    const csvKeys: string[] = await this.listCsvKeys();
    const result: CsvFiles = {};

    await Promise.all(
      csvKeys.map(async (key: string) => {
        const data: CsvRow[] = await this.loadCsvFromS3(key);
        const fileName: string = key.split('/').pop() || key;
        result[fileName] = data;
      }),
    );

    return result;
  }

  private async listCsvKeys(): Promise<string[]> {
    const command: ListObjectsV2Command = new ListObjectsV2Command({
      Bucket: this.bucketName,
      Prefix: this.prefix,
    });

    const response: ListObjectsV2CommandOutput =
      await this.s3Client.send(command);
    return (response.Contents || [])
      .map((obj: _Object) => obj.Key || '')
      .filter((key: string) => key.endsWith('.csv'));
  }

  private async loadCsvFromS3(key: string): Promise<CsvRow[]> {
    const command: GetObjectCommand = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });

    const response: GetObjectCommandOutput = await this.s3Client.send(command);
    const content: string | undefined =
      await response.Body?.transformToString('utf-8');

    if (!content) {
      throw new Error('No content received from S3');
    }

    return this.parseCsvContent(content);
  }

  private parseCsvContent(content: string): CsvRow[] {
    const lines: string[] = content
      .split(/\r?\n/)
      .filter((line: string) => line.length > 0);
    if (lines.length === 0) return [];

    const firstLine: string | undefined = lines[0];
    if (!firstLine) return [];

    const separator: string =
      (firstLine.match(/,/g) || []).length >=
      (firstLine.match(/;/g) || []).length
        ? ','
        : ';';
    const headers: string[] = this.parseCsvLine(firstLine, separator);

    return lines.slice(1).map((line: string) => {
      const values: string[] = this.parseCsvLine(line, separator);
      const obj: CsvRow = {};
      headers.forEach((header: string, idx: number) => {
        obj[header] = values[idx] ?? '';
      });
      return obj;
    });
  }

  private parseCsvLine(line: string, separator: string): string[] {
    const result: string[] = [];
    let current: string = '';
    let inQuotes: boolean = false;

    for (let i = 0; i < line.length; i++) {
      const char: string | undefined = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === separator && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }

    result.push(current.trim());
    return result.map((field: string) => field.replace(/^"|"$/g, ''));
  }
}

export { S3Service };
