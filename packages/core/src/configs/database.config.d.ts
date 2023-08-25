import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CustomNamingStrategy } from '../utils/typeorm/naming.strategy';
export declare const DATABASE: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    autoLoadEntities: boolean;
    synchronize: boolean;
    migrationsRun: boolean;
    migrations: string[];
    cli: {
        migrationsDir: string;
    };
    namingStrategy: CustomNamingStrategy;
    keepConnectionAlive: boolean;
};
export declare const TEST_DATABASE: {
    type: string;
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
    entities: string[];
    autoLoadEntities: boolean;
    synchronize: boolean;
    namingStrategy: CustomNamingStrategy;
    keepConnectionAlive: boolean;
};
export declare const databaseConfig: (() => TypeOrmModuleOptions) & import("@nestjs/config").ConfigFactoryKeyHost<TypeOrmModuleOptions>;
