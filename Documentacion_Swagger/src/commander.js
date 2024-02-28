import { Command } from 'commander';

const program = new Command();

program
    .option('-d, --debug', 'Variables para debug', false)
    .option('-p <option>, --persistence <option>', 'Persistence', String);

program.parse();

export const programOPTS = program.opts();