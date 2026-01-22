/**
 * CLI argument parsing
 */

export interface CliOptions {
  verbose: boolean;
  account?: number;
  refresh: boolean;
  help: boolean;
}

/**
 * Parse command line arguments
 */
export function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    verbose: false,
    refresh: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
      case '-v':
      case '--verbose':
        options.verbose = true;
        break;

      case '-a':
      case '--account':
        const accountNum = parseInt(args[i + 1], 10);
        if (!isNaN(accountNum) && accountNum > 0) {
          options.account = accountNum;
          i++; // Skip next arg (the account number)
        } else {
          console.error('Error: --account requires a valid account number (1, 2, 3, ...)');
          process.exit(1);
        }
        break;

      case '-r':
      case '--refresh':
        options.refresh = true;
        break;

      case '-h':
      case '--help':
        options.help = true;
        break;

      default:
        if (arg.startsWith('-')) {
          console.error(`Unknown option: ${arg}`);
          console.error('Use --help to see available options');
          process.exit(1);
        }
    }
  }

  return options;
}

/**
 * Display help message
 */
export function showHelp(): void {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║    Google/Antigravity Quota Checker - Multi-Account      ║
╚═══════════════════════════════════════════════════════════╝

USAGE:
  gquota [options]

OPTIONS:
  (none)              Show compact table view (default)
  -v, --verbose       Show detailed view with all models
  -a, --account <N>   Show only account #N (1-based index)
  -r, --refresh       Force refresh (bypass cache)
  -h, --help          Show this help message

EXAMPLES:
  gquota                    # Quick table overview
  gquota -v                 # Detailed view with all models
  gquota --account 1        # Show only first account details
  gquota -v --refresh       # Detailed view with fresh data
  gquota -a 2 -r            # Account #2 with fresh data

MODES:
  Table View (default):  Compact overview of all accounts
  Detailed View (-v):    Full model-by-model breakdown
  Single Account (-a):   Focus on specific account

For more info: https://github.com/ninhhaidang/opencode-antigravity-quota
`);
}
