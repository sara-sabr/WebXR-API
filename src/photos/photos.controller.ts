/* eslint-disable prettier/prettier */
import {
  Controller,
  Get,
  Header,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import { PhotosService } from './photos.service'

@Controller('photos')
export class PhotosController {

  constructor(private readonly photoservice: PhotosService) {}
  @Get()
  takePhoto(): string {
    return 'This is the photo route'
  }

  @Get(':name')
  @Header('Content-Type', 'image/png')
  async getImage(@Res() res, @Param() params): Promise<string>{
    const file =  await this.photoservice.getImageFile(params.name);
    return file.pipe(res);
  }


  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  async uploadFile(@UploadedFile() photo: Express.Multer.File) {
    await this.photoservice.upload(photo);
    return "Photo has been uploaded";
  }
}
