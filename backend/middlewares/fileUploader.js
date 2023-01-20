
import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier';

const upload = multer();





export const fileUploader=  async (req, res, next) => {
  const middleware=  upload.array('file')

  return middleware(req, res, async () => {

    try {
        cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    const streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.buffer).pipe(stream);
      });
    };

    var imageUrlList = [];
    
    for (var i = 0; i < req.files.length; i++) {
       var localFile = req.files[i];
      const result = await streamUpload(localFile);
      imageUrlList.push(result.url);
    }
    req.filesURL= await imageUrlList
    next()
    } catch (error) {
        
      console.log(error)
    }
    
  })



}