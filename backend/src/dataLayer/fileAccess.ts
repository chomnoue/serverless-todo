import {XAWS} from "./aws";


export class TodoAccess {

  constructor(
      private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
      private readonly attachmentsBucket = process.env.ATTACHMENTS_BUCKET
  ) {
  }

  getGetSignedUrl( key: string ): string {
    return this.getSignedUrl('getObject', key)
  }

  getPutSignedUrl(key: string): string {
    return this.getSignedUrl('putObject', key)
  }

  private getSignedUrl(action: string, key: string) {
    const signedUrlExpireSeconds = 60 * 5
    return this.s3.getSignedUrl(action, {
      Bucket: this.attachmentsBucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    });
  }
}
