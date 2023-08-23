import express from 'express';
import {
    fileStreamingHandler,
} from '../controllers/file.controller';


const router = express.Router();

router.get('/:fileId', fileStreamingHandler);
// router.get('/:fileId', validate(getFileByIdSchema), fileStreamingHandler);



export default router;
