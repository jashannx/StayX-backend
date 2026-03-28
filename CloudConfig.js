import cloudinary from 'cloudinary';
import cloudinaryStorage from 'multer-storage-cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,  
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: 'StayX',
    allowedFormats: ['jpg', 'jpeg', 'png'],
});
export default {storage , cloudinary};