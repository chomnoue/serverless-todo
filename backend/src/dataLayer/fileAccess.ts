import {XAWS} from "./aws";


export class TodoAccess {

  constructor(
      private readonly s3 = new XAWS.S3({signatureVersion: 'v4'}),
      private readonly attachmentsBucket = process.env.ATTACHMENTS_BUCKET
  ) {
  }

  getAttachmentUrl(todoId: String): string {
    return `https://${this.attachmentsBucket}.s3.amazonaws.com/${todoId}`
  }

  getPutSignedUrl(key: string): string {
    const signedUrlExpireSeconds = 60 * 5;
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.attachmentsBucket,
      Key: key,
      Expires: signedUrlExpireSeconds,
    });
  }
}
