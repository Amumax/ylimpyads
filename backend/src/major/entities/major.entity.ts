import {BaseEntity, Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity({name: "majors"})
export class Major extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number;
    @Column({ type: "varchar"})
    name: string;
    @Column({ type: "varchar"})
    code: string;
}
