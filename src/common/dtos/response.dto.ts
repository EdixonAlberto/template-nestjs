import { ApiProperty } from '@nestjs/swagger'

export class ResponseDto<D = null> {
  @ApiProperty()
  readonly statusCode: number

  @ApiProperty()
  readonly message: string

  @ApiProperty()
  readonly data?: D | null

  @ApiProperty()
  readonly errors: string[]

  constructor(response: ResponseDto<D>) {
    this.statusCode = response.statusCode
    this.message = response.message
    this.data = response.data || null
    this.errors = response.errors || []
  }
}
