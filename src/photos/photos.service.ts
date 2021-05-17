/* eslint-disable prettier/prettier */
import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';
import { Injectable } from '@nestjs/common';
@Injectable()
export class PhotosService {
  azureConnectString = process.env.AZURE_STORAGE_CONNECTION_STRING;
  containerName = process.env.AZURE_CONTAINER_NAME;

  getBlobClient(imgName:string):BlockBlobClient{
    const blobClientService = BlobServiceClient.fromConnectionString(this.azureConnectString);
    const containerClient = blobClientService.getContainerClient(this.containerName);
    const blobClient = containerClient.getBlockBlobClient(imgName);
    return blobClient;  
  }

  async upload(file:Express.Multer.File){
    const blobClient = this.getBlobClient(file.originalname);
    await blobClient.uploadData(file.buffer);
  }

  async getImageFile(filename: string){
      const blobClient = this.getBlobClient(filename);
      const blobDownloaded = await blobClient.download();
      return blobDownloaded.readableStreamBody;
  }

}
