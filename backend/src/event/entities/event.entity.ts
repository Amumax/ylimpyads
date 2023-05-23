import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, RelationId, JoinColumn} from "typeorm";
import {Olimpiad} from "../../olimpiad/entities/olimpiad.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: "events"})
export class Events extends BaseEntity {
    @PrimaryGeneratedColumn()
    @ApiProperty()
    id: number;
    @Column({ type: "varchar"})
    @ApiProperty()
    name: string;
    @Column({ type: "date"})
    @ApiProperty()
    start: Date;
    @Column({ type: "date"})
    @ApiProperty()
    finish: Date;
    @ManyToOne((type) => Olimpiad, (olimp) => olimp.id)
    @JoinColumn({name: "olimpiad"})
    olimpiad: Olimpiad;
    @RelationId((evt: Events) => evt.olimpiad)
    olimpiadId: number;
}
