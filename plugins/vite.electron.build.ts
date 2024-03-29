//生产环境的electron插件
import type { Plugin } from 'vite';
import builder from "electron-builder";
import { buildBackground } from './utils';
import path from 'path';
import fs from 'fs'

export const electronBuildPlugin = (): Plugin => {
    return {
        name: 'electron-build-plugin',
        apply: 'build',
        closeBundle() {
            buildBackground()

            const json = JSON.parse(fs.readFileSync('package.json', 'utf-8'))
            json.main = 'background.js'
            fs.writeFileSync('dist/package.json', JSON.stringify(json, null, 4))
            fs.mkdirSync('dist/node_modules')

            builder.build({
                config: {
                    directories: {
                        output: path.resolve(process.cwd(), 'release'),
                        app: path.resolve(process.cwd(), 'dist')
                    },
                    asar: true,
                    appId: 'com.electron.electron-vite-vue',
                    productName: 'electron-vite-vue',
                    nsis: {
                        oneClick: false,    //一键安装
                        allowElevation: true,   //允许提升
                        allowToChangeInstallationDirectory: true,   //允许修改安装目录
                        runAfterFinish: true    //安装完成后运行
                    },
                }
            })
        }
    }
}