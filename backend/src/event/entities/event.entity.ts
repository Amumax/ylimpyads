import {BaseEntity, Column, Entity, PrimaryGeneratedColumn, ManyToOne, RelationId, JoinColumn} from "typeorm";
import {Olimpiad} from "../../olimpiad/entities/olimpiad.entity";

@Entity({name: "events"})
export class Events extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @Column({ type: "date"})
    start: Date;
    @Column({ type: "date"})
    finish: Date;
    @ManyToOne((type) => Olimpiad, (olimp) => olimp.id)
    @JoinColumn({name: "olimpiad"})
    olimpiad: Olimpiad;
    @RelationId((evt: Events) => evt.olimpiad)
    olimpiadId: number;
}
