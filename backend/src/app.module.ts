import {Module} from '@nestjs/common';
import {AppController} from './app.controller';
import {AppService} from './app.service';
import {OlimpiadModule} from './olimpiad/olimpiad.module';
import {HostsModule} from './hosts/hosts.module';
import {ConfigModule, ConfigService} from '@nestjs/config';
import {TypeOrmModule} from "@nestjs/typeorm";
import {AdminModule} from '@adminjs/nestjs'
import * as AdminJSTypeorm from '@adminjs/typeorm'
import dbConfiguration from "./config/db.config";
import AdminJS from "adminjs";
import {Host} from "./hosts/entities/host.entity";
import {Olimpiad} from "./olimpiad/entities/olimpiad.entity";
import {AppDataSource} from "./config/typeorm.datasource";
import { ProfileModule } from './profile/profile.module';
import { ClassModule } from './class/class.module';
import { EventModule } from './event/event.module';
import { MajorModule } from './major/major.module';
import {Class} from "./class/entities/class.entity";
import {Major} from "./major/entities/major.entity";
import {Profile} from "./profile/entities/profile.entity";
import {Events} from "./event/entities/event.entity";
import { BonusTypeModule } from './bonus_type/bonusType.module';
import { HostBonusModule } from './host_bonus/hostBonus.module';

AdminJS.registerAdapter({
    Resource: AdminJSTypeorm.Resource,
    Database: AdminJSTypeorm.Database,
})

@Module({
    imports: [
        ClassModule,
        EventModule,
        HostsModule,
        MajorModule,
        OlimpiadModule,
        ProfileModule,
        BonusTypeModule,
        HostBonusModule,
        ConfigModule.forRoot({
            isGlobal: true,
            load: [dbConfiguration],
        }),
        TypeOrmModule.forRootAsync({
            inject: [ConfigService],
            useFactory: async (configService: ConfigService) => ({...configService.get('database')})
        }),
        AdminModule.createAdminAsync({
            useFactory: () => ({
                adminJsOptions: {
                    rootPath: '/admin',
                    resources: [Class, Events, Host, Major, Olimpiad, Profile],
                    databases: [AppDataSource],
                    locale: {
                        language: 'en',
                        translations: {
                            labels: {
                                Class: 'Направления',
                                Events: 'События',
                                Host: 'Организаторы',
                                Major: 'Специальность ВУЗ',
                                Olimpiad: 'Олимпиады',
                                Profile: 'Профили'
                            }
                        }
                    }
                },
            }),
        }),
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {
}
