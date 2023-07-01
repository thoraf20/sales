import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./User";
import { Sale } from "./Sales";

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

  @OneToMany(() => Sale, (sale) => sale.customers)
  sales: Sale[]

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;

}