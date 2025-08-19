import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();
cloudinary.config({
    cloud_name: "dfuxutqkg",
    api_key: "187346476187183",
    api_secret: "NET0HeeWX9BJLidV9Is3i0U9TP4",
    secure: true,
});

export default cloudinary;