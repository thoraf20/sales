import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import bcrypt from "bcrypt"
import { Customer } from "./Customer";

@Entity("users")
export class User extends BaseEntity {
  @BeforeInsert()
  nameToLowerCase() {
    this.email = this.email.toLowerCase();
  }
  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 12);
  }

  static async comparePasswords(
    userPassword: string,
    hashedPassword: string
  ) {
    return await bcrypt.compare(userPassword, hashedPassword);
  }

  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Index('email_index')
  @Column({ nullable: false })
  email: string;

  @Column({ nullable: false })
  password: string;

  @Column({ nullable: false })
  fullName: string;

  @Column({ nullable: true })
  businessName: string;

  @Column({ nullable: true })
  phoneNumber: string;

  @OneToMany(() => Customer, (customer) => customer.user)
  customers: Customer[]

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;

  toJSON() {
    return { ...this, password: undefined };
  }
}