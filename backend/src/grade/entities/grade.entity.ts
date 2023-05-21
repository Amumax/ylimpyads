import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Olimpiad} from "../../olimpiad/entities/olimpiad.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: "grades"})
export class Grade extends BaseEntity{
    @PrimaryColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @ManyToMany(type => Olimpiad)
    @JoinTable({
        name: "olimpiad_grades",
        joinColumn: {
            name: "grade",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_grade"
        },
        inverseJoinColumn: {
            name: "olimpiad",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_olimpiad"
        }
    })
    @ApiProperty()
    olimpiad: Olimpiad[];
    @RelationId((grade: Grade) => grade.olimpiad)
    olimpiadIds: number[];

}
