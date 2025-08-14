//--------------------------------------------------------------------------------------------------------------------

import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

//--------------------------------------------------------------------------------------------------------------------

const ROLES_KEY: string = 'roles';
const Roles = (...roles: Role[]): ReturnType<typeof SetMetadata> =>
  SetMetadata(ROLES_KEY, roles);

export { ROLES_KEY, Roles };
