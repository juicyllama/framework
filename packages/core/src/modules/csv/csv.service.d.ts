/// <reference types="multer" />
export declare class CsvService {
    parseCsvFile(file: Express.Multer.File): Promise<any[]>;
}
