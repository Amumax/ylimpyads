import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, RelationId} from "typeorm";

/*
create table bonus_type
(
    id           integer not null primary key generated always as identity,
    name         varchar not null, -- имя бонуса, например БВИ
    type         integer,            -- тип бонуса, насколько понимаю бывают двух видов - БВИ, то есть даёт 100 баллов, или ИД - дополнительные баллы к предмету
    extra_points integer,            -- количество баллов
    award_Level  integer             -- место которое нужно занять для получения этого бонуса
);
*/
@Entity({name: "bonus_type"})
export class BonusType extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @Column({ nullable: true})
    type: number;
    @Column({ name: 'extra_points', nullable: true})
    extraPoints: number;
    @Column({ name: 'award_level', nullable: true})
    awardLevel: number;
}
