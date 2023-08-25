import { DefaultNamingStrategy, Table, NamingStrategyInterface } from 'typeorm';
export declare class CustomNamingStrategy extends DefaultNamingStrategy implements NamingStrategyInterface {
    foreignKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath?: string): string;
    primaryKeyName(tableOrName: Table | string, columnNames: string[], referencedTablePath?: string): string;
}
