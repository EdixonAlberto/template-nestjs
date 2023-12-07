import { ApiProperty } from '@nestjs/swagger'

export class StatusResponse {
  @ApiProperty()
  readonly status: string

  @ApiProperty()
  readonly version: string

  @ApiProperty()
  readonly description: string

  @ApiProperty()
  readonly author: string

  @ApiProperty()
  readonly serverDate: string

  constructor(status: StatusResponse) {
    this.status = status.status
    this.version = status.version
    this.description = status.description
    this.author = status.author
    this.serverDate = status.serverDate
  }
}
