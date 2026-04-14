import 'source-map-support/register';
import * as core from '@actions/core';
import { main } from './main';

function handleError(error: unknown): void {
  if (typeof error === 'string') {
    core.setFailed(error);
  } else if (error instanceof Error) {
    core.setFailed(error.message);
    if (error.stack != null) {
      core.error(error.stack);
    }
  } else {
    core.setFailed('An unknown error occurred');
  }
}

main().catch(handleError);
