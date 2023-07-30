import fs, { type Stats } from 'fs'
import path from 'path'
import { minimatch } from 'minimatch'

export const FileSystem = {
  getIfExists(path: string): unknown {
    return fs.existsSync(path) ? require(path) : {} // Open user config JSON
  },

  walkDir(dir: string, callback: (filepath: string, stats: Stats) => void): void {
    const files = fs.readdirSync(dir)

    files.forEach((file) => {
      const filepath = path.join(dir, file)
      const stats = fs.statSync(filepath)

      if (stats.isDirectory()) {
        FileSystem.walkDir(filepath, callback)
      } else if (stats.isFile()) {
        callback(filepath, stats)
      }
    })
  },

  writeFile(dir: string, filename: string, content: string): void {
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(`${dir}/${filename}`, content)
  },

  readFile(filepath: string) {
    return fs.readFileSync(filepath).toString()
  },

  readDirectory(dir: string, config?: { ignore?: string[] }): string[] {
    const { ignore } = config
    const directoryContent = []

    FileSystem.walkDir(dir, (filepath: string) => {
      for (let index = 0; index < ignore.length; index++) {
        if(minimatch(`./${filepath}`, `${ignore[index]}`)) {
          return
        }
      }

      const fileContent = FileSystem.readFile(filepath)
      directoryContent.push(fileContent)
    })

    return directoryContent
  },
}
