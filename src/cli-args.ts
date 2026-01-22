/**
 * CLI argument parsing
 */

export interface CliOptions {
  account?: number;
  refresh: boolean;
  help: boolean;
}

/**
 * Parse command line arguments
 */
export function parseCliArgs(args: string[]): CliOptions {
  const options: CliOptions = {
    refresh: false,
    help: false,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    switch (arg) {
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
Google/Antigravity Quota Checker - Multi-Account
═════════════════════════════════════════════════

USAGE:
  gquota [options]

OPTIONS:
  (none)              Show pivot table (default)
  -a, --account <N>   Show only account #N (1-based index)
  -r, --refresh       Force refresh (bypass cache)
  -h, --help          Show this help message

EXAMPLES:
  gquota                    # Pivot table overview
  gquota --account 1        # Show only first account details
  gquota --refresh          # Fresh data (bypass cache)
  gquota -a 2 -r            # Account #2 with fresh data

OUTPUT:
  Pivot table showing all models as rows and accounts as columns.
  Progress bars and colors indicate quota health:
    Green  (80-100%)  - Healthy
    Yellow (50-79%)   - Warning
    Red    (<50%)     - Critical

For more info: https://github.com/ninhhaidang/opencode-antigravity-quota
`);
}
