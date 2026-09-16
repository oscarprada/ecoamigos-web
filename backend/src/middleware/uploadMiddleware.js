import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import { pipeline } from 'node:stream';
import { randomUUID } from 'node:crypto';
import { uploadsRoot, removeStored } from '../services/fileStore.js';
import { formats, extension, fileLimits, FileError } from '../services/fileFormats.js';
import { detectFile } from '../services/fileValidation.js';

export function receiveUpload(kind) {
  const limits = fileLimits();
  const storage = {
    _handleFile(req, file, cb) {
      (async () => {
        const directory = path.join(uploadsRoot(),'managed',kind);
        await fs.promises.mkdir(uploadsRoot(),{recursive:true});
        let parent = uploadsRoot();
        for (const segment of ['managed',kind]) {
          parent=path.join(parent,segment);
          try { await fs.promises.mkdir(parent); } catch(error) { if(error.code!=='EEXIST') throw error; }
          const info=await fs.promises.lstat(parent);
          if(info.isSymbolicLink() || !info.isDirectory()) throw Error('Unsafe storage');
        }
        const root = await fs.promises.realpath(uploadsRoot()), real = await fs.promises.realpath(directory);
        const relative = path.relative(root,real);
        if(relative.startsWith('..') || path.isAbsolute(relative)) throw Error('Unsafe storage');
        const filename=randomUUID()+'.'+extension(file.originalname);
        const url='/uploads/managed/'+kind+'/'+filename;
        const target=path.join(directory,filename);
        const stream=fs.createWriteStream(target,{flags:'wx',mode:0o600});
        let created=false;stream.once('open',()=>{created=true;});
        pipeline(file.stream,stream,async error=>{
          if(error){if(created) await removeStored(url);return cb(error);}
          cb(null,{filename,path:target,url,size:stream.bytesWritten});
        });
      })().catch(cb);
    },
    _removeFile(req,file,cb) { removeStored(file.url).then(()=>cb(null),cb); },
  };
  const parser=multer({storage,limits:{fileSize:kind==='evidence'?limits.evidence:Math.max(limits.image,limits.video,limits.file),files:1,fields:24,parts:25,fieldSize:64*1024},
    fileFilter(req,file,cb){
      const format=formats[extension(file.originalname)];
      if(!format || (kind==='evidence' && format.kind==='file') || !format.aliases.includes(file.mimetype)) return cb(new FileError(415,'Tipo de archivo no permitido'));
      cb(null,true);
    }}).single(kind==='evidence'?'evidence':'file');
  return (req,res,next)=>parser(req,res,async error=>{
    try {
      if(error) throw error;
      if(req.file){
        const format=formats[extension(req.file.filename)];
        if(!req.file.size) throw new FileError(400,'Archivo vacío');
        if(req.file.size>limits[format.kind]) throw new FileError(413,'Archivo demasiado grande');
        const detected=await detectFile(req.file.path);
        if(!detected || detected.ext!==extension(req.file.filename)) throw new FileError(415,'Contenido del archivo inválido');
        if(kind==='content' && req.body.type!==format.kind) throw new FileError(400,'El archivo no corresponde al tipo de contenido');
      }
      next();
    } catch(failure){
      if(req.file) await removeStored(req.file.url);
      const status=failure instanceof FileError?failure.status:failure.code==='LIMIT_FILE_SIZE'?413:failure instanceof multer.MulterError?400:500;
      const message=failure instanceof FileError?failure.message:status===413?'Archivo demasiado grande':status===400?'Carga de archivos inválida':'No fue posible almacenar el archivo';
      res.status(status).json({message});
    }
  });
}
// Preserve route shape for existing consumers; every field still receives one file only.
export const upload = { single: () => receiveUpload('evidence') };
export const contentUpload = { single: () => receiveUpload('content') };
