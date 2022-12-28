import {BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable, RelationId} from 'typeorm';
import {Olimpiad} from "../../olimpiad/entities/olimpiad.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: "hosts"})
export class Host extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @Column({ type: "varchar", nullable: true })
    region: string;
    @Column({ type: "varchar", nullable: true })
    city: string;
    @Column({ type: "varchar", nullable: true })
    address: string;
    @Column({ type: "char", length: 22, nullable: true })
    phone: string;
    @Column({ type: "varchar", nullable: true })
    url: string;
    @Column({ type: "varchar", nullable: true })
    email: string;
    @Column({ type: "varchar", nullable: true })
    official_name: string;
    @ManyToMany(type => Olimpiad)
    @JoinTable({
        name: "olimpiad_hosts",
        joinColumn: {
            name: "host",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_host"
        },
        inverseJoinColumn: {
            name: "olimpiad",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_olimpiad"
        }
    })
    @ApiProperty()
    olimpiad: Olimpiad[];
    @RelationId((host: Host) => host.olimpiad)
    olimpiadIds: number[];
}
