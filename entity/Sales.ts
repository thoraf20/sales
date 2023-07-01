import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Customer } from "./Customer";

 export type Item = {
  item: string;
  description: string;
  price: number;
  quantity: number;
 }

 export enum Status {
  PENDING = 'pending_payment',
  DUE = 'payment_due',
  PAID = 'paid',
}

@Entity("sales")
export class Sale extends BaseEntity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

 @PrimaryGeneratedColumn("increment")
  invoiceNumber: number

  @Column({ nullable: true,  type: 'jsonb', default: () => "'[]'" })
  item: [Item];

  @Column({ nullable: false })
  total: number;

  @Column({ nullable: false, type: 'enum', enum: Status, default: Status.PENDING })
  status: Status;

  @Column({ nullable: false })
  userId: string

  @Column({ nullable: false })
  customerId: string

  @ManyToOne(() => Customer, (customer) => customer.sales)
  @JoinColumn({ name: 'customerId', referencedColumnName: 'id' })
  customers: Customer

  @CreateDateColumn()
  created_at: Date;
    
  @UpdateDateColumn()
  updated_at: Date;
}