import {BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, RelationId, OneToMany} from 'typeorm';
import {ApiProperty} from "@nestjs/swagger";
import {Host} from "../../hosts/entities/host.entity";
import {Events} from "../../event/entities/event.entity";
import {Class} from "../../class/entities/class.entity";
import {Profile} from "../../profile/entities/profile.entity";

@Entity({name: 'olimpiads'})
export class Olimpiad extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;

    @Column({ type: "varchar"})
    @ApiProperty()
    name: string;
    @Column({ type: "varchar"})
    @ApiProperty()
    url: string;
    @Column()
    @ApiProperty()
    rating: number;
    @Column()
    @ApiProperty()
    level: number;
    @ManyToMany(type => Host, {eager: true})
    @JoinTable({
        name: "olimpiad_hosts",
        joinColumn: {
            name: "olimpiad",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_olimpiad"
        },
        inverseJoinColumn: {
            name: "host",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_host"
        }
    })
    @ApiProperty()
    host: Host[];
    @RelationId((olimp: Olimpiad) => olimp.host)
    hostIds: number[];
    @ApiProperty()
    @OneToMany((type) => Events, (evt) => evt.olimpiad, {eager: true})
    event: Events[];
    @RelationId((olimp: Olimpiad) => olimp.event)
    eventIds: number[];
    @ManyToMany(type => Class, {eager: true})
    @JoinTable({
        name: "olimpiad_classes",
        joinColumn: {
            name: "olimpiad",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_olimpiad"
        },
        inverseJoinColumn: {
            name: "class",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_class"
        }
    })
    @ApiProperty()
    class: Class[];
    @RelationId((olimp: Olimpiad) => olimp.class)
    classIds: number[];
    @ManyToMany(type => Profile, {eager: true})
    @JoinTable({
        name: "olimpiad_profiles",
        joinColumn: {
            name: "olimpiad",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_olimpiad"
        },
        inverseJoinColumn: {
            name: "profile",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_profile"
        }
    })
    @ApiProperty()
    profile: Profile[];
    @RelationId((olimp: Olimpiad) => olimp.profile)
    profileIds: number[];
}
