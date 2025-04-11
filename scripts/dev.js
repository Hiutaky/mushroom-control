import { exec, spawn } from "child_process";

const backend = spawn( 'npm', ['start'] )
backend.stdout.on('data', (data) => console.log(data.toString()))

exec('cp -rf ../../.env .env', {
    cwd: './app/frontend'
})
const frontend = spawn( 'npm', ['start'], {
    cwd: './app/frontend'
})
frontend.stdout.on('data', (data) => console.log(data.toString()))
