import {
  Logger,
  MiddlewareConsumer,
  Module,
  ValidationPipe,
} from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./app/user/user.module";
import { ResponseService } from "./common/response.service";
import { databaseConfig } from "./config/database.config";
import { MulterConfig } from "./config/multer.config";
import { MulterModule } from "@nestjs/platform-express";
import { LoggerMiddleware } from "./middlewares/logger.middleware";
import { APP_PIPE } from "@nestjs/core";
import { ServeStaticModule } from "@nestjs/serve-static/dist/serve-static.module";
import { join } from "path";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { BookModule } from "./app/book/book.module";
@Module({
  controllers: [AppController],
  providers: [
    AppService,
    ResponseService,
    Logger,
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    MulterModule.register(MulterConfig),
    UserModule,
    BookModule,
    ServeStaticModule.forRoot({
      serveRoot: "/uploads",
      rootPath: join(__dirname, "..", "/uploads"),
    }),
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes("*");
  }
}
