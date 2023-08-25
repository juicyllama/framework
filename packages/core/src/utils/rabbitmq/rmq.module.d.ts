import { DynamicModule } from '@nestjs/common';
interface RmqModuleOptions {
    name: string;
}
export declare class RmqModule {
    static register({ name }: RmqModuleOptions): DynamicModule;
}
export {};
