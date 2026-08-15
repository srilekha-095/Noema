const { v2: cloudinary } = require('cloudinary');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ensureCloudinaryConfig = () => {
  if (!cloudinary.config().cloud_name || !cloudinary.config().api_key || !cloudinary.config().api_secret) {
    throw new Error('Cloudinary environment variables are missing');
  }
};

const uploadImageBuffer = (fileBuffer, mimeType = 'image/jpeg', folder = 'noema-posts') => {
  ensureCloudinaryConfig();
  const base64 = fileBuffer.toString('base64');
  const dataUri = `data:${mimeType};base64,${base64}`;

  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: 'image',
  });
};

const deleteCloudinaryImage = async (publicId) => {
  if (!publicId) return;
  ensureCloudinaryConfig();
  await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
};

module.exports = {
  uploadImageBuffer,
  deleteCloudinaryImage,
};
