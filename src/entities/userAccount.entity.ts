import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { UserDeviceRelation } from "./userDeviceRelation.entity";
import { Book } from "./book.entity";
import { Address } from "./address.entity";

@Entity("user_account")
export class UserAccount {
  static createQueryBuilder() {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  userId: number;

  @Column("character varying", { nullable: true })
  firstName: string;

  @Column("character varying", { nullable: true })
  lastName: string;

  @Column("character varying", { nullable: true })
  email: string;

  @Column("character varying", { nullable: true })
  password: string;

  @Column("character varying", { nullable: true })
  user_image: string;

  @Column("smallint", { nullable: true, default: 0 })
  isVerify: number;

  @Column("smallint", { nullable: true, default: 0 })
  isDeleted: number;

  @Column("smallint", { nullable: true, default: 1 })
  isActive: number;

  @Column("smallint", { nullable: true })
  register_type: number;

  @Column("character varying", { nullable: true })
  appleId: string;

  @Column("character varying", { nullable: true })
  googleId: string;

  @Column("character varying", { nullable: true })
  instagramId: string;

  @Column("integer", { nullable: true })
  otp: number;

  @Column("text", { nullable: true })
  authToken: string;

  @Column("text", { nullable: true })
  refresh_token: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @OneToMany(
    () => UserDeviceRelation,
    (rl_userDeviceRelation) => rl_userDeviceRelation.rl_useraccount,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  rl_userDeviceRelation: UserDeviceRelation[];

  @OneToMany(() => Book, (rl_book) => rl_book.rl_useraccount, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  rl_book: Book[];

  @OneToMany(() => Address, (rl_address) => rl_address.rl_useraccount, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  rl_address: Address[];
}
