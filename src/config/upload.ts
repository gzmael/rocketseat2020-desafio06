import multer from 'multer';
import path from 'path';

const csvUpload = path.resolve(__dirname, '..', '..', 'tmp', 'csv');

const csvConfig = {
  directory: csvUpload,
  /*   fileFilter: (_, file, callback): any => {
    const regex = new RegExp('text/csv');

    if (!regex.test(file.mimetype)) {
      // Send Error
      return callback(new AppError('File Document not valid.'));
    }

    return callback(null, true);
  }, */
  storage: multer.diskStorage({
    destination: csvUpload,
    filename: (request, file, callback) => {
      const fileHash = new Date().getTime().toString();
      const fileName = `${fileHash.substr(-8)}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};

export default csvConfig;
