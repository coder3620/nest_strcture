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

@Entity("book")
export class Book {
  static createQueryBuilder() {
    throw new Error("Method not implemented.");
  }
  @PrimaryGeneratedColumn()
  bookId: number;

  @Column({ nullable: true })
  fk_user_id: number;

  @Column("character varying", { nullable: true })
  title: string;

  @Column("character varying", { nullable: true })
  author: string;

  @Column("integer", { nullable: true })
  publicationYear: number;

  @Column("character varying", { nullable: true })
  publisher: string;

  @Column("integer", { nullable: true })
  pageCount: number;

  @Column("character varying", { nullable: true })
  format: string;

  @Column("character varying", { nullable: true })
  language: string;

  @Column("character varying", { nullable: true })
  description: string;

  @Column("smallint", { nullable: true, default: 1 })
  isActiveBook: number;

  @Column("character varying", { array: true, nullable: true, default: [] })
  book_image: string[];

  @CreateDateColumn({ type: "timestamp" })
  createdAt: Date;

  @UpdateDateColumn({ type: "timestamp" })
  updatedAt: Date;

  @ManyToOne(() => UserAccount, (rl_useraccount) => rl_useraccount.rl_book, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "fk_user_id" })
  rl_useraccount: UserAccount[];
}
