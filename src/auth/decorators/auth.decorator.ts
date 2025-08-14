//--------------------------------------------------------------------------------------------------------------------

import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';

//--------------------------------------------------------------------------------------------------------------------

function Auth() {
  return applyDecorators(UseGuards(AuthGuard));
}

export { Auth };
