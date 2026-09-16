import { parentPort, workerData } from 'node:worker_threads';
import fs from 'node:fs/promises';
import { fileTypeFromFile } from 'file-type';
try {
  const type = await fileTypeFromFile(workerData);
  const file = await fs.open(workerData, 'r');
  try {
    const {size} = await file.stat();
    const head=Buffer.alloc(Math.min(size,16)), tail=Buffer.alloc(Math.min(size,65557));
    await file.read(head,0,head.length,0);await file.read(tail,0,tail.length,size-tail.length);
    let complete = size > 0;
    if(type?.ext==='jpg') complete = size>=4 && tail.subarray(-2).equals(Buffer.from([255,217]));
    if(type?.ext==='png') complete = size>=45 && tail.subarray(-12,-4).equals(Buffer.from([0,0,0,0,73,69,78,68]));
    if(type?.ext==='pdf') complete = tail.toString('latin1').trimEnd().endsWith('%%EOF');
    if(['avi','webp'].includes(type?.ext)) complete = size>=16 && head.readUInt32LE(4)+8===size;
    if(type?.ext==='docx') complete = tail.lastIndexOf(Buffer.from([80,75,5,6]))>=0;
    parentPort.postMessage(complete ? type || null : null);
  } finally { await file.close(); }
} catch { parentPort.postMessage(null); }
