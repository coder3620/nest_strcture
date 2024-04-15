import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserAccount } from "./userAccount.entity";
import { AddressType } from "./addressType.entity";

@Entity("address")
export class Address {
  static createQueryBuilder() {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  addressId: number;

  @Column({ nullable: true })
  fk_user_id: number;

  @Column("smallint", { nullable: true })
  fk_address_type: number;

  @Column("integer", { nullable: true })
  blockNo: number;

  @Column("integer", { nullable: true })
  streetNo: number;

  @Column("character varying", { nullable: true })
  streetName: string;

  @Column("character varying", { nullable: true })
  city: string;

  @Column("character varying", { nullable: true })
  state: string;

  @Column("character varying", { nullable: true })
  postalCode: string;

  @Column("character varying", { nullable: true })
  country: string;

  @Column("integer", { nullable: true })
  latitude: number;

  @Column("integer", { nullable: true })
  longitude: number;

  @Column("smallint", { nullable: true, default: 1 })
  isActiveAddress: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => UserAccount, (rl_useraccount) => rl_useraccount.rl_address, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "fk_user_id" })
  rl_useraccount: UserAccount[];

  @ManyToOne(() => AddressType, (rl_addressType) => rl_addressType.rl_address, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "fk_address_type" })
  rl_addressType: AddressType[];
}
