import { Injectable, BadRequestException } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class AwsService {
    private s3 = new S3Client({
        region: process.env.AWS_REGION || 'us-east-2',
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID || process.env.accesskey_bucket!,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || process.env.secretkey_bucket!,
        }
    })

    async uploadFile(file: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
        destination?: string;
        filename?: string;
        path?: string;
    }) {
        try {
            if (!file) throw new BadRequestException('File is required');
            const key = `${Date.now()}-${file.originalname}`;
            const bucket = process.env.S3_BUCKET || 'oxxo-project';
            const url = `https://${bucket}.s3.${process.env.AWS_REGION || 'us-east-2'}.amazonaws.com/${key}`;
            const command = new PutObjectCommand({
                Key: key,
                Body: file.buffer,
                Bucket: bucket,
                ContentType: file.mimetype,

            })
            await this.s3.send(command);
            return { url };
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw error;
        }
    }
}
