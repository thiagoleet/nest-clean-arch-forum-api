import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KET = 'isPublic';

export const Public = () => SetMetadata(IS_PUBLIC_KET, true);
