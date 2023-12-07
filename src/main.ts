import { NestFactory } from '@nestjs/core'
import { HttpException, HttpStatus, Logger, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { NestExpressApplication } from '@nestjs/platform-express'

import { AppModule } from './app.module'
import { ResponseDto } from './common/dtos'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule)
  const loggerAPI = new Logger('API')
  const config = app.get(ConfigService)
  const portHTTP = Number(config.get<string>('PORT')) || 3000
  const whiteList = config.get<string>('WHITE_LIST')?.split(',') || []
  const PATH_DOCS = 'api/docs'
  const pkg = await import('../package.json')
  const options = new DocumentBuilder()
    .setTitle(pkg.name.split('-').join(' ').toUpperCase())
    .setDescription(pkg.description)
    .setVersion(pkg.version)
    .build()
  const document = SwaggerModule.createDocument(app, options)

  // Ejecutar página estática para mostrar documentación "OpenAPI"
  SwaggerModule.setup(PATH_DOCS, app, document, {
    customSiteTitle: 'Docs - Lupa Backend'
  })

  // Habilitar CORS
  app.enableCors({
    origin(origin, callback) {
      if (!origin || whiteList.includes(origin)) {
        callback(null, true)
      } else {
        callback(
          new HttpException(
            new ResponseDto({
              statusCode: HttpStatus.UNAUTHORIZED,
              message: 'CORS error',
              errors: ['Not allowed by CORS']
            }),
            HttpStatus.UNAUTHORIZED
          )
        )
      }
    },
    methods: 'OPTIONS,GET,POST,PATCH,DELETE'
  })

  // Establecer "pipe" global para validar y convertir datos de todas las peticiones
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: false
      }
    })
  )

  await app.listen(portHTTP, async () => {
    loggerAPI.log(`Server listening in port ${portHTTP}`)
    loggerAPI.log(`Documentation OpenAPI in path "/${PATH_DOCS}"`)
  })
}
bootstrap()
