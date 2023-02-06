import fs from 'fs'
import path from 'path'


export class FileSystem {
 
  static walkDir(dir: string, callback: Function): void {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      var filepath = path.join(dir, file);
      const stats = fs.statSync(filepath);

      if (stats.isDirectory()) {
        FileSystem.walkDir(filepath, callback);
      } else if (stats.isFile()) {
        callback(filepath, stats);
      }
    })
  }

  static writeFile = (dir: string, filename: string, content: string): void => {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(`${dir}/${filename}`, content)
  }
}
