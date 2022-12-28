/*
-- собственно начисляемые бонусы
-- тут ещё хитрость в чём - host в этой таблице может быть не только организатор олимпиады, а ВУЗ который принимает для себя результаты этой олимпиады

create table host_bonuses
(
    id           integer not null primary key generated always as identity,
    host       integer not null, -- организатор
    olimpiad   integer not null, -- олимпиада
    class      integer,          -- специальность
    profile    integer,          -- или профиль для этой олимпиады
    host_major integer,          -- специальность университета
    bonus_type integer,          -- ссылка на тип бонуса
    CONSTRAINT fk_olimpiad
        FOREIGN KEY(olimpiad)
            REFERENCES olimpiads(id) on delete cascade,
    constraint fk_class
        foreign key (class)
            references classes(id) on delete cascade,
    constraint fk_profile
        foreign key (profile)
            references profile(id) on delete cascade,
    constraint fk_host_major
        foreign key (host_major)
            references majors(id) on delete cascade,
    constraint fk_bonuses
        foreign key (bonus_type)
            references bonus_type(id) on delete cascade
);
*/

import { ApiProperty } from "@nestjs/swagger";
import { BonusType } from "src/bonus_type/entities/bonusType.entity";
import { Class } from "src/class/entities/class.entity";
import { Host } from "src/hosts/entities/host.entity";
import { Major } from "src/major/entities/major.entity";
import { Olimpiad } from "src/olimpiad/entities/olimpiad.entity";
import { Profile } from "src/profile/entities/profile.entity";
import {BaseEntity, Column, Entity, JoinColumn, JoinTable, ManyToMany, OneToMany, OneToOne, PrimaryGeneratedColumn, RelationId} from "typeorm";

@Entity({name: "host_bonuses"})
export class HostBonus extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @ApiProperty()
    @OneToOne(() => Host)
    @JoinColumn({ name: 'host'})
    host: Host;
    @ApiProperty()
    @OneToOne(() => Olimpiad)
    @JoinColumn({ name: 'olimpiad'})
    olimpiad: Olimpiad;
    @ApiProperty()
    @OneToOne(() => Class)
    @JoinColumn({ name: 'class'})
    class: Class;
    @ApiProperty()
    @OneToOne(() => Profile)
    @JoinColumn({ name: 'profile'})
    profile: Profile;
    @ApiProperty()
    @OneToOne(() => Major)
    @JoinColumn({ name: 'host_major'})
    hostMajor: Major;
    @ApiProperty()
    @OneToOne(() => BonusType)
    @JoinColumn({ name: 'bonus_type'})
    bonusType: BonusType;
}
