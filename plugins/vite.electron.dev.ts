//开发环境的插件 electron插件
import type { Plugin } from 'vite';
import type { AddressInfo } from 'net';
import { spawn } from 'child_process';
import electron from 'electron';
import fs from 'fs';
import { buildBackground } from './utils';

export const electronDevPlugin = (): Plugin => {
    return {
        name: 'electron-dev-plugin',
        configureServer(server) {
            buildBackground()

            server?.httpServer?.once('listening', () => {
                // 获取端口地址
                const addressInfo = server?.httpServer?.address() as AddressInfo;
                // 给electron启动服务
                const IP = `http://localhost:${addressInfo.port}`;
                let electronProcess = spawn(electron as any, ['dist/background.js', IP])

                // 监听到文件变化，重启electron
                fs.watchFile('src/background.ts', () => {
                    electronProcess.kill()
                    buildBackground()
                    electronProcess = spawn(electron as any, ['dist/background.js', IP])
                })
            });
        }
    }
}