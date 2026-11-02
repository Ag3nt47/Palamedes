// Build an animated gallery of actual app screenshots with an installed FFmpeg.
import { mkdir, writeFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const media=path.join(root,'docs','media');
const names=['calculator','graphing','surface','solver','ml-lab','training','sandbox','handbook','settings'];
const temporary=path.join(root,'.local');await mkdir(temporary,{recursive:true});
const list=names.map(name=>`file '${path.join(media,name+'.png').replaceAll('\\','/')}'\nduration 2`).join('\n')+`\nfile '${path.join(media,'settings.png').replaceAll('\\','/')}'\n`;
const input=path.join(temporary,'demo-frames.txt');await writeFile(input,list);
const executable=process.env.FFMPEG_PATH||'ffmpeg';
const args=['-y','-f','concat','-safe','0','-i',input,'-vf','fps=4,scale=1120:770:force_original_aspect_ratio=decrease,pad=1120:770:(ow-iw)/2:(oh-ih)/2:color=0x0a0e14,split[a][b];[a]palettegen=max_colors=128[p];[b][p]paletteuse=dither=bayer:bayer_scale=3','-loop','0',path.join(media,'palamedes-demo.gif')];
await new Promise((resolve,reject)=>{const child=spawn(executable,args,{stdio:'inherit',windowsHide:true});child.on('error',reject);child.on('exit',code=>code===0?resolve():reject(Error(`FFmpeg exited ${code}`)))});
