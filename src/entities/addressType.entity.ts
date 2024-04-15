import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Address } from "./address.entity";

@Entity("address_type")
export class AddressType {
  static createQueryBuilder() {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  addressTypeId: number;

  @Column("character varying", { nullable: true })
  typeName: number;

  @Column("smallint", { nullable: true, default: 1 })
  isActive: number;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(() => Address, (rl_address) => rl_address.rl_addressType, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  rl_address: Address[];
}
