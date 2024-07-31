import * as fs from 'fs';
import { join } from 'path';
import { SERVE_STATIC_PATH } from '../constants/system.constants';

const rootPath = process.cwd();

export async function  loadFile(filePath: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        const path = join(rootPath,SERVE_STATIC_PATH, filePath);
        console.log(path);
        fs.readFile(path, (err, data) => {
            if (err) {
                console.error(`Failed to load file: ${err.message}`);
                return reject(err);
            }
            resolve(data);
        });
    });
}
