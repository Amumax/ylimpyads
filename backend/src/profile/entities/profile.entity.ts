import {BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryGeneratedColumn, RelationId} from "typeorm";
import {Olimpiad} from "../../olimpiad/entities/olimpiad.entity";
import {ApiProperty} from "@nestjs/swagger";

@Entity({name: "profile"})
export class Profile extends BaseEntity{
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @ManyToMany(type => Olimpiad)
    @JoinTable({
        name: "olimpiad_profiles",
        joinColumn: {
            name: "profile",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_profile"
        },
        inverseJoinColumn: {
            name: "olimpiad",
            referencedColumnName: "id",
            foreignKeyConstraintName: "fk_olimpiad"
        }
    })
    @ApiProperty()
    olimpiad: Olimpiad[];
    @RelationId((profile: Profile) => profile.olimpiad)
    olimpiadIds: number[];

}
