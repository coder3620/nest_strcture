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

@Entity("user_device_relation")
export class UserDeviceRelation {
  @PrimaryGeneratedColumn()
  user_device_relation_id: number;

  @Column({ nullable: true })
  fk_user_id: number;

  @Column("character varying", { nullable: true })
  deviceId: string;

  @Column("character varying", { nullable: true })
  deviceToken: string;

  @Column("smallint", { nullable: true })
  deviceType: number;

  @Column("text", { nullable: true })
  os: string;

  @Column("character varying", { nullable: true })
  appVersion: string;

  @Column("character varying", { nullable: true })
  current_version: string;

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(
    () => UserAccount,
    (rl_useraccount) => rl_useraccount.rl_userDeviceRelation,
    { onDelete: "CASCADE", onUpdate: "CASCADE" }
  )
  @JoinColumn({ name: "fk_user_id" })
  rl_useraccount: UserAccount[];
}
