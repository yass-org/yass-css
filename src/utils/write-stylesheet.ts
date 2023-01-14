import fs from 'fs/promises'
import { Config } from '../config';


const writeStylesheet = async (content: string, config: Config): Promise<void> => {
  await fs.mkdir(config.stylesheet.buildPath, { recursive: true });
  await fs.writeFile(`${config.stylesheet.buildPath}/${config.stylesheet.filename}`, content)
} 

export default writeStylesheet
