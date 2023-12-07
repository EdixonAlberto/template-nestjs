import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common'
import { Observable, catchError, throwError } from 'rxjs'

import { ResponseDto } from '~/common/dtos'

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<ResponseDto<any>> {
    return next.handle().pipe(
      catchError((error: HttpException & TypeError & Error /* & ... */) => {
        let response: ResponseDto = null
        let statusCode = HttpStatus.INTERNAL_SERVER_ERROR

        if (error instanceof HttpException) {
          statusCode = error.getStatus()
          const { error: errorMessage, message } = error.getResponse() as HttpException & { error: string }
          const errors: string[] = Array.isArray(message) ? message : [message]

          response = new ResponseDto({
            statusCode,
            message: errorMessage,
            errors
          })
        }

        // Capturar error del ORM
        if (!response /* && error instanceof ... */) {
          const { message } = error /* as ... */

          response = new ResponseDto({
            statusCode,
            message: 'ORM error',
            errors: [message]
          })
        }

        if (!response && error instanceof TypeError) {
          const { message } = error as TypeError

          response = new ResponseDto({
            statusCode,
            message: 'TypeScript error',
            errors: [message]
          })
        }

        if (!response && error instanceof Error) {
          const { message } = error as Error

          response = new ResponseDto({
            statusCode,
            message: 'Server error',
            errors: [message]
          })
        }

        if (!response) {
          console.error(error)
          response = new ResponseDto({
            statusCode,
            message: 'Server error',
            errors: [error?.message || '']
          })
        }

        return throwError(() => new HttpException(response, statusCode))
      })
    )
  }
}
