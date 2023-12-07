import { Injectable, CanActivate, ExecutionContext, UnauthorizedException, HttpStatus } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigService } from '@nestjs/config'
import { Observable } from 'rxjs'
import { Request } from 'express'
import { IncomingHttpHeaders } from 'http'

import { ResponseDto } from '~/common/dtos'

@Injectable()
export class AccessControlGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly config: ConfigService
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const _ = this.reflector.get<unknown>('ROLES', context.getHandler())
    const [req] = context.getArgs() as [Request]

    // Validar encabezado de api-key
    const { 'api-key': apiKey } = req.headers as IncomingHttpHeaders & { 'api-key': string }
    if (!apiKey) this.responseUnathorized("Header 'Api-Key' is required")

    // Validar api-key
    // { ... }

    return true
  }

  private responseUnathorized(errorMessage: string): void {
    throw new UnauthorizedException(
      new ResponseDto({
        statusCode: HttpStatus.UNAUTHORIZED,
        message: 'Unauthorized',
        errors: [errorMessage]
      })
    )
  }
}
