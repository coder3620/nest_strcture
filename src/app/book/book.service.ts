/* eslint-disable @typescript-eslint/no-var-requires */
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Book } from "src/entities/book.entity";
import { AddBookDto } from "./dto/addBook.dto";
import { UpdateBookDto } from "./dto/updateBook.dto";

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Book)
    public bookRepository: Repository<Book>
  ) {}

  async addBook(
    userId: number,
    body: AddBookDto,
    bookImages: string[]
  ): Promise<Book> {
    try {
      const newBook = this.bookRepository.create({
        fk_user_id: userId,
        title: body.title,
        author: body.author,
        publicationYear: body.publicationYear,
        pageCount: body.pageCount,
        language: body.language,
        publisher: body.publisher,
        description: body.description,
        format: body.format,
        isActiveBook: 1,
      });

      newBook.book_image = bookImages;

      return await this.bookRepository.save(newBook);
    } catch (error) {
      throw new UnauthorizedException(error.message);
    }
  }

  async getOwnBooks(userId: number): Promise<any> {
    try {
      console.log("user id ++++++++++++", userId);

      const bookData: any = await this.bookRepository
        .createQueryBuilder("book")
        .select([
          `book.bookId as "bookId",
          book.fk_user_id as "fk_user_id",
          book.title as "title",
          book.author as "author",
          book.publicationYear as "publicationYear",
          book.publisher as "publisher",
          book.pageCount as "pageCount",
          book.format as "format",
          book.language as "language",
          book.description as "description",
          book.isActiveBook as "isActiveBook",
          book.book_image as "bookImage"`,
        ])
        .andWhere("book.fk_user_id = :fk_user_id", { fk_user_id: userId })
        .execute();

      const booksWithImageUrl = bookData.map((book: any) => {
        return {
          ...book,
          bookImage: book.bookImage.map(
            (imageName: string) => `${process.env.IMAGE_URL}/${imageName}`
          ),
        };
      });

      return booksWithImageUrl;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }

  async updateBook(body: UpdateBookDto, bookImages: string[]): Promise<any> {
    try {
      const book: Book = new Book();

      book.title = body.title;
      book.author = body.author;
      book.publicationYear = body.publicationYear;
      book.publisher = body.publisher;
      book.pageCount = body.pageCount;
      book.format = body.format;
      book.language = body.language;
      book.description = body.description;
      book.isActiveBook = 1;
      book.book_image = bookImages;

      if (bookImages) {
        book.book_image = bookImages;
      }
      await this.bookRepository.update({ bookId: body.bookId }, book);

      // console.log("userData------ ", userData);

      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
