#!/usr/bin/env node

import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const HOME = process.env.HOME || '/root';
const GLOBAL_DIR = `${HOME}/.config/opencode/agents`;
const PROJECT_DIR = `.opencode/agents`;
const REPO_ROOT = path.resolve(__dirname, '..');
const AGENTS_SOURCE = `${REPO_ROOT}/src/agents`;

const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const YELLOW = '\x1b[33m';
const CYAN = '\x1b[36m';
const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';

const log = {
  ok: (msg) => console.log(`${GREEN}[OK]${RESET} ${msg}`),
  error: (msg) => console.log(`${RED}[ERROR]${RESET} ${msg}`),
  warn: (msg) => console.log(`${YELLOW}[WARNING]${RESET} ${msg}`),
  info: (msg) => console.log(`${CYAN}[INFO]${RESET} ${msg}`),
};

function isOpenCodeRunning() {
  try {
    execSync('pgrep -f opencode', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

function getAvailableAgents() {
  const agents = [];
  if (!fs.existsSync(AGENTS_SOURCE)) return agents;

  const domains = fs.readdirSync(AGENTS_SOURCE, { withFileTypes: true });
  for (const domain of domains) {
    if (!domain.isDirectory()) continue;
    const agentDir = path.join(AGENTS_SOURCE, domain.name);
    const files = fs.readdirSync(agentDir);

    for (const file of files) {
      if (file.endsWith('.md') && file !== 'STATUS.md' && file !== 'CHANGELOG.md') {
        const agentName = path.basename(file, '.md');
        agents.push({ name: agentName, domain: domain.name });
      }
    }
  }
  return agents;
}

function getInstalledAgents() {
  const installed = { global: [], project: [] };

  if (fs.existsSync(GLOBAL_DIR)) {
    const files = fs.readdirSync(GLOBAL_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const target = path.join(GLOBAL_DIR, file);
        if (fs.lstatSync(target).isSymbolicLink()) {
          installed.global.push(path.basename(file, '.md'));
        }
      }
    }
  }

  if (fs.existsSync(PROJECT_DIR)) {
    const files = fs.readdirSync(PROJECT_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const target = path.join(PROJECT_DIR, file);
        if (fs.lstatSync(target).isSymbolicLink()) {
          installed.project.push(path.basename(file, '.md'));
        }
      }
    }
  }

  return installed;
}

function createSymlink(source, target) {
  try {
    fs.symlinkSync(source, target, 'file');
    return true;
  } catch (err) {
    if (err.code === 'EEXIST') {
      fs.unlinkSync(target);
      fs.symlinkSync(source, target, 'file');
      return true;
    }
    return false;
  }
}

function removeSymlink(target) {
  try {
    fs.unlinkSync(target);
    return true;
  } catch {
    return false;
  }
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function installAgentsGlobal() {
  const agents = getAvailableAgents();
  if (agents.length === 0) {
    log.error('No agents found in repository');
    return;
  }

  const choices = agents.map(a => ({
    name: `${a.name} (${a.domain})`,
    value: a.name,
    checked: false
  }));

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: 'Select agents to install (global)',
    choices: choices,
    pageSize: 20
  }]);

  if (!selected || selected.length === 0) {
    log.info('Installation cancelled');
    return;
  }

  ensureDir(GLOBAL_DIR);

  console.log('');
  log.info(`Installing ${selected.length} agent(s) to global...`);
  console.log('');

  let success = 0;
  let failed = 0;

  for (const agentName of selected) {
    const agent = agents.find(a => a.name === agentName);
    const source = path.join(AGENTS_SOURCE, agent.domain, `${agentName}.md`);
    const target = path.join(GLOBAL_DIR, `${agentName}.md`);

    if (fs.existsSync(source)) {
      if (createSymlink(source, target)) {
        log.ok(agentName);
        success++;
      } else {
        log.error(agentName);
        failed++;
      }
    } else {
      log.error(`${agentName} (source not found)`);
      failed++;
    }
  }

  console.log('');
  log.info(`Installed: ${success} | Failed: ${failed}`);
}

async function installAgentsProject() {
  const agents = getAvailableAgents();
  if (agents.length === 0) {
    log.error('No agents found in repository');
    return;
  }

  const choices = agents.map(a => ({
    name: `${a.name} (${a.domain})`,
    value: a.name,
    checked: false
  }));

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: 'Select agents to install (project)',
    choices: choices,
    pageSize: 20
  }]);

  if (!selected || selected.length === 0) {
    log.info('Installation cancelled');
    return;
  }

  ensureDir(PROJECT_DIR);

  console.log('');
  log.info(`Installing ${selected.length} agent(s) to project...`);
  console.log('');

  let success = 0;
  let failed = 0;

  for (const agentName of selected) {
    const agent = agents.find(a => a.name === agentName);
    const source = path.join(AGENTS_SOURCE, agent.domain, `${agentName}.md`);
    const target = path.join(PROJECT_DIR, `${agentName}.md`);

    if (fs.existsSync(source)) {
      if (createSymlink(source, target)) {
        log.ok(agentName);
        success++;
      } else {
        log.error(agentName);
        failed++;
      }
    } else {
      log.error(`${agentName} (source not found)`);
      failed++;
    }
  }

  console.log('');
  log.info(`Installed: ${success} | Failed: ${failed}`);
}

async function removeAgents() {
  const installed = getInstalledAgents();
  const allInstalled = [...new Set([...installed.global, ...installed.project])];

  if (allInstalled.length === 0) {
    log.info('No agents installed');
    return;
  }

  const choices = allInstalled.map(name => ({
    name,
    value: name,
    checked: false
  }));

  const { selected } = await inquirer.prompt([{
    type: 'checkbox',
    name: 'selected',
    message: 'Select agents to remove',
    choices: choices,
    pageSize: 20
  }]);

  if (!selected || selected.length === 0) {
    log.info('Removal cancelled');
    return;
  }

  const { confirm } = await inquirer.prompt([{
    type: 'confirm',
    name: 'confirm',
    message: `Remove ${selected.length} agent(s)?`,
    default: false
  }]);

  if (!confirm) {
    log.info('Removal cancelled');
    return;
  }

  console.log('');
  log.info(`Removing ${selected.length} agent(s)...`);
  console.log('');

  let success = 0;
  let failed = 0;

  for (const agentName of selected) {
    let removed = false;

    const globalTarget = path.join(GLOBAL_DIR, `${agentName}.md`);
    const projectTarget = path.join(PROJECT_DIR, `${agentName}.md`);

    if (fs.existsSync(globalTarget)) {
      if (removeSymlink(globalTarget)) removed = true;
    }
    if (fs.existsSync(projectTarget)) {
      if (removeSymlink(projectTarget)) removed = true;
    }

    if (removed) {
      log.ok(agentName);
      success++;
    } else {
      log.error(agentName);
      failed++;
    }
  }

  console.log('');
  log.info(`Removed: ${success} | Failed: ${failed}`);
}

async function listAgents() {
  const agents = getAvailableAgents();
  const installed = getInstalledAgents();

  console.log('');
  console.log(`${BOLD}INSTALLED AGENTS${RESET}`);
  console.log('─'.repeat(58));
  console.log(`${BOLD}  AGENT              DOMAIN        GLOBAL  PROJECT${RESET}`);
  console.log('─'.repeat(58));

  for (const agent of agents) {
    const gStatus = installed.global.includes(agent.name) ? `${GREEN}[yes]${RESET}` : '[no] ';
    const pStatus = installed.project.includes(agent.name) ? `${GREEN}[yes]${RESET}` : '[no] ';
    console.log(`  ${agent.name.padEnd(18)}${agent.domain.padEnd(12)}${gStatus}  ${pStatus}`);
  }

  console.log('─'.repeat(58));
  console.log('');
  console.log(`Total agents: ${agents.length} | Global: ${installed.global.length} | Project: ${installed.project.length}`);
}

async function checkOpenCode() {
  console.log('');
  const running = isOpenCodeRunning();
  if (running) {
    log.warn('OpenCode is currently running');
    log.info('It may automatically manage agent files');
  } else {
    log.ok('OpenCode is not running');
  }
  console.log('');
}

async function main() {
  const actions = [
    { name: 'Install agents (global)', value: 'install-global', icon: '🌐' },
    { name: 'Install agents (project)', value: 'install-project', icon: '📁' },
    { name: 'Remove agents', value: 'remove', icon: '🗑️' },
    { name: 'List installed agents', value: 'list', icon: '📋' },
    { name: 'Check OpenCode status', value: 'check', icon: '🔍' },
    new inquirer.Separator(),
    { name: 'Exit', value: 'exit', icon: '👋' }
  ];

  while (true) {
    console.clear();
    console.log(`${BOLD}${CYAN}`);
    console.log('╭──────────────────────────────────────╮');
    console.log('│   OpenCode Agents Manager v1.0       │');
    console.log('╰──────────────────────────────────────╯');
    console.log(`${RESET}`);

    const { action } = await inquirer.prompt([{
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: actions,
      default: 'install-global'
    }]);

    console.clear();

    switch (action) {
      case 'install-global':
        await installAgentsGlobal();
        break;
      case 'install-project':
        await installAgentsProject();
        break;
      case 'remove':
        await removeAgents();
        break;
      case 'list':
        await listAgents();
        break;
      case 'check':
        await checkOpenCode();
        break;
      case 'exit':
        console.log(`${CYAN}Goodbye!${RESET}\n`);
        process.exit(0);
    }

    await inquirer.prompt([{
      type: 'input',
      name: 'continue',
      message: 'Press Enter to continue...'
    }]);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});