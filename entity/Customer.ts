import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";

@Entity("customers")
export class Customer extends BaseEntity {
  @BeforeInsert()
  nameToLowerCase() {
    this.email = this.email.toLowerCase();
    this.fullName = this.fullName.toLowerCase();
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: false })
  phoneNumber: string;

  @ManyToOne(() => User, (user) => user.customers)
  user: User

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;

}