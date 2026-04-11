const { PutObjectCommand, DeleteObjectCommand } = require("@aws-sdk/client-s3");
const sharp = require("sharp");
const { v4: uuidv4 } = require("uuid");
const s3Client = require("../config/s3");

const BUCKET = process.env.AWS_S3_BUCKET;

const uploadImage = async (file, folder = "products") => {
  // Resize and optimize
  const buffer = await sharp(file.buffer)
    .resize(800, 800, { fit: "inside", withoutEnlargement: true })
    .webp({ quality: 80 })
    .toBuffer();

  const key = `${folder}/${uuidv4()}.webp`;

  await s3Client.send(
    new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: buffer,
      ContentType: "image/webp",
    })
  );

  return `https://${BUCKET}.s3.amazonaws.com/${key}`;
};

const deleteImage = async (imageUrl) => {
  const key = imageUrl.split(".amazonaws.com/")[1];
  if (!key) return;

  await s3Client.send(
    new DeleteObjectCommand({
      Bucket: BUCKET,
      Key: key,
    })
  );
};

module.exports = { uploadImage, deleteImage };
