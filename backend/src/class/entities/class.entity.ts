import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Olimpiad} from "../../olimpiad/entities/olimpiad.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: "classes"})
export class Class extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @ManyToMany(type => Olimpiad)
    @JoinTable({
        name: "olimpiad_classes",
        joinColumn: {
            name: "class",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_class"
        },
        inverseJoinColumn: {
            name: "olimpiad",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_olimpiad"
        }
    })
    @ApiProperty()
    olimpiad: Olimpiad[];
    @RelationId((clazz: Class) => clazz.olimpiad)
    olimpiadIds: number[];
}
