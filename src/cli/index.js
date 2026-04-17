import inquirer from 'inquirer';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseArgs } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, '../..');
const AGENTS_SOURCE = `${REPO_ROOT}/src/agents`;

const HOME = process.env.HOME || '/root';
const GLOBAL_DIR = `${HOME}/.config/opencode/agents`;
const PROJECT_DIR = '.opencode/agents';

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
        try {
          if (fs.lstatSync(target).isSymbolicLink()) {
            installed.global.push(path.basename(file, '.md'));
          }
        } catch {}
      }
    }
  }

  if (fs.existsSync(PROJECT_DIR)) {
    const files = fs.readdirSync(PROJECT_DIR);
    for (const file of files) {
      if (file.endsWith('.md')) {
        const target = path.join(PROJECT_DIR, file);
        try {
          if (fs.lstatSync(target).isSymbolicLink()) {
            installed.project.push(path.basename(file, '.md'));
          }
        } catch {}
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

async function installAgentsGlobal(selectedAgents = null) {
  const agents = getAvailableAgents();
  if (agents.length === 0) {
    log.error('No agents found in repository');
    return 1;
  }

  let toInstall;

  if (selectedAgents) {
    toInstall = selectedAgents;
  } else {
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
      return 0;
    }
    toInstall = selected;
  }

  ensureDir(GLOBAL_DIR);

  console.log('');
  log.info(`Installing ${toInstall.length} agent(s) to global...`);
  console.log('');

  let success = 0;
  let failed = 0;

  for (const agentName of toInstall) {
    const agent = agents.find(a => a.name === agentName);
    if (!agent) {
      log.error(`${agentName} not found in repository`);
      failed++;
      continue;
    }
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
  return failed > 0 ? 1 : 0;
}

async function installAgentsProject(selectedAgents = null) {
  const agents = getAvailableAgents();
  if (agents.length === 0) {
    log.error('No agents found in repository');
    return 1;
  }

  let toInstall;

  if (selectedAgents) {
    toInstall = selectedAgents;
  } else {
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
      return 0;
    }
    toInstall = selected;
  }

  ensureDir(PROJECT_DIR);

  console.log('');
  log.info(`Installing ${toInstall.length} agent(s) to project...`);
  console.log('');

  let success = 0;
  let failed = 0;

  for (const agentName of toInstall) {
    const agent = agents.find(a => a.name === agentName);
    if (!agent) {
      log.error(`${agentName} not found in repository`);
      failed++;
      continue;
    }
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
  return failed > 0 ? 1 : 0;
}

async function removeAgents(selectedAgents = null) {
  const installed = getInstalledAgents();
  const allInstalled = [...new Set([...installed.global, ...installed.project])];

  if (allInstalled.length === 0) {
    log.info('No agents installed');
    return 0;
  }

  let toRemove;

  if (selectedAgents) {
    toRemove = selectedAgents;
  } else {
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
      return 0;
    }
    toRemove = selected;
  }

  if (!selectedAgents) {
    const { confirm } = await inquirer.prompt([{
      type: 'confirm',
      name: 'confirm',
      message: `Remove ${toRemove.length} agent(s)?`,
      default: false
    }]);

    if (!confirm) {
      log.info('Removal cancelled');
      return 0;
    }
  }

  console.log('');
  log.info(`Removing ${toRemove.length} agent(s)...`);
  console.log('');

  let success = 0;
  let failed = 0;

  for (const agentName of toRemove) {
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
  return failed > 0 ? 1 : 0;
}

function listAgents() {
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
  return 0;
}

function checkOpenCode() {
  console.log('');
  const running = isOpenCodeRunning();
  if (running) {
    log.warn('OpenCode is currently running');
    log.info('It may automatically manage agent files');
  } else {
    log.ok('OpenCode is not running');
  }
  console.log('');
  return 0;
}

function showHelp() {
  console.log(`
${BOLD}OpenCode Agents CLI${RESET}

${CYAN}Usage:${RESET}
  agents-cli [command] [options]

${CYAN}Commands:${RESET}
  install    Install agents (interactive or specified)
  remove     Remove installed agents
  list       List all available and installed agents
  check      Check OpenCode status
  help       Show this help message

${CYAN}Options:${RESET}
  --global, -g    Install to global directory
  --project, -p   Install to project directory (default)
  --agent, -a     Specify agent name(s) to install/remove
  --all, -A        Select all agents
  --help, -h       Show help
  --version, -v    Show version

${CYAN}Examples:${RESET}
  agents-cli install                    # Interactive install
  agents-cli install --global           # Install all to global (interactive)
  agents-cli install --agent code-reviewer  # Install specific agent (global)
  agents-cli install -g -a code-reviewer docs-writer
  agents-cli remove --agent security-auditor
  agents-cli list
  agents-cli check

${CYAN}Agent Paths:${RESET}
  Global:  ${GLOBAL_DIR}
  Project: ${PROJECT_DIR}
`);
}

function showVersion() {
  console.log('agents-cli v1.0.0');
}

async function interactive() {
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
        listAgents();
        break;
      case 'check':
        checkOpenCode();
        break;
      case 'exit':
        console.log(`${CYAN}Goodbye!${RESET}\n`);
        return 0;
    }

    await inquirer.prompt([{
      type: 'input',
      name: 'continue',
      message: 'Press Enter to continue...'
    }]);
  }
}

export async function run() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    return await interactive();
  }

  if (args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    showHelp();
    return 0;
  }

  if (args[0] === 'version' || args[0] === '--version' || args[0] === '-v') {
    showVersion();
    return 0;
  }

  const command = args[0];
  const subArgs = args.slice(1);

  if (command === 'install') {
    if (subArgs.includes('--help') || subArgs.includes('-h')) {
      console.log(`
${BOLD}install command${RESET}

${CYAN}Usage:${RESET}  agents-cli install [options]

${CYAN}Options:${RESET}
  -g, --global     Install to global directory (~/.config/opencode/agents)
  -p, --project    Install to project directory (.opencode/agents)
  -a, --agent      Specify agent name(s)
  -A, --all        Install all available agents

${CYAN}Examples:${RESET}
  agents-cli install                     # Interactive (project)
  agents-cli install -g                  # Interactive (global)
  agents-cli install -g -a code-reviewer
  agents-cli install -A -g               # Install all to global
  agents-cli install -a code-reviewer docs-writer
`);
      return 0;
    }

    let global = false;
    let project = false;
    let agents = null;
    let installAll = false;

    const filteredArgs = subArgs.filter(a => !a.startsWith('--help') && !a.startsWith('-h'));

    const { values } = parseArgs({
      args: filteredArgs,
      options: {
        global: { short: 'g', type: 'boolean' },
        project: { short: 'p', type: 'boolean' },
        agent: { short: 'a', type: 'string', multiple: true },
        all: { short: 'A', type: 'boolean' }
      },
      allowPositionals: true
    });

    global = values.global || false;
    project = values.project || false;
    installAll = values.all || false;

    if (values.agent) {
      agents = Array.isArray(values.agent) ? values.agent : [values.agent];
    }

    if (installAll && !agents) {
      const allAgents = getAvailableAgents();
      agents = allAgents.map(a => a.name);
    }

    if (global) {
      return await installAgentsGlobal(agents);
    } else if (project) {
      return await installAgentsProject(agents);
    } else {
      if (agents) {
        return await installAgentsProject(agents);
      } else {
        const available = getAvailableAgents();
        if (available.length === 0) {
          log.error('No agents found in repository');
          return 1;
        }
        return await installAgentsProject(null);
      }
    }
  }

  if (command === 'remove') {
    if (subArgs.includes('--help') || subArgs.includes('-h')) {
      console.log(`
${BOLD}remove command${RESET}

${CYAN}Usage:${RESET}  agents-cli remove [options]

${CYAN}Options:${RESET}
  -a, --agent      Specify agent name(s) to remove
  -A, --all        Remove all installed agents

${CYAN}Examples:${RESET}
  agents-cli remove -a code-reviewer
  agents-cli remove -a code-reviewer docs-writer
  agents-cli remove -A
`);
      return 0;
    }

    let agents = null;

    const filteredArgs = subArgs.filter(a => !a.startsWith('--help') && !a.startsWith('-h'));

    const { values } = parseArgs({
      args: filteredArgs,
      options: {
        agent: { short: 'a', type: 'string', multiple: true },
        all: { short: 'A', type: 'boolean' }
      },
      allowPositionals: true
    });

    if (values.agent) {
      agents = Array.isArray(values.agent) ? values.agent : [values.agent];
    }

    if (values.all && !agents) {
      const installed = getInstalledAgents();
      agents = [...new Set([...installed.global, ...installed.project])];
    }

    return await removeAgents(agents);
  }

  if (command === 'list') {
    return listAgents();
  }

  if (command === 'check') {
    return checkOpenCode();
  }

  log.error(`Unknown command: ${command}`);
  showHelp();
  return 1;
}