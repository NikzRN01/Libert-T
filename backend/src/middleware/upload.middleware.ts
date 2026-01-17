import multer from "multer";

const MAX_AVATAR_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export const avatarUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: MAX_AVATAR_SIZE_BYTES,
        files: 1,
    },
    fileFilter: (_req, file, cb) => {
        const isImage = file.mimetype.startsWith("image/");
        if (!isImage) {
            cb(new Error("Only image files are allowed"));
            return;
        }
        cb(null, true);
    },
});
