import { Controller, Get, Module } from '@nestjs/common'
import { APP_INTERCEPTOR } from '@nestjs/core'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { StatusResponse } from '~/common/dtos/status.dto'
import { ResponseInterceptor } from '~/common/interceptors/response.interceptor'

@ApiTags('Api')
@Controller('api')
class ApiController {
  @Get()
  @ApiOkResponse({ type: StatusResponse, description: 'Status API' })
  async status(): Promise<StatusResponse> {
    const pkg = await import('../package.json')
    return new StatusResponse({
      status: 'OK',
      version: pkg.version,
      author: pkg.author,
      description: pkg.description,
      serverDate: new Date().toISOString()
    })
  }
}

@Module({
  imports: [],
  controllers: [ApiController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor
    }
  ]
})
export class AppModule {}
