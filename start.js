const os = require('os');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

// 1. Get the local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            // Skip over internal (i.e. 127.0.0.1) and non-IPv4 addresses
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1'; // fallback
}

const ip = getLocalIP();
console.log(`\nLocal Network IP found: ${ip}`);

// 2. Update client/.env
const clientEnvPath = path.join(__dirname, 'client', '.env');
if (fs.existsSync(clientEnvPath)) {
    let envContent = fs.readFileSync(clientEnvPath, 'utf8');

    // Replace VITE_API_URL if it exists, otherwise append it
    if (envContent.includes('VITE_API_URL=')) {
        envContent = envContent.replace(/VITE_API_URL=.*/g, `VITE_API_URL=http://${ip}:5000`);
    } else {
        envContent += `\nVITE_API_URL=http://${ip}:5000\n`;
    }

    fs.writeFileSync(clientEnvPath, envContent);
    console.log(`Updated client/.env with VITE_API_URL=http://${ip}:5000`);
} else {
    console.warn(`client/.env not found at ${clientEnvPath}`);
}

// 3. Start server
console.log('Starting Backend...');
const serverProcess = spawn('node', ['index.js'], {
    cwd: path.join(__dirname, 'server'),
    stdio: 'inherit',
    shell: true
});

// 4. Start client
console.log(`Starting Frontend on http://${ip}:5173 (or assigned port)\n`);
const clientProcess = spawn('npm', ['run', 'dev', '--', '--host'], {
    cwd: path.join(__dirname, 'client'),
    stdio: 'inherit',
    shell: true
});

serverProcess.on('close', (code) => {
    console.log(`Server process exited with code ${code}`);
});
clientProcess.on('close', (code) => {
    console.log(`Client process exited with code ${code}`);
});

// Handle graceful shutdown
const shutdown = () => {
    console.log('\nShutting down...');
    serverProcess.kill('SIGINT');
    clientProcess.kill('SIGINT');
    process.exit();
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
