import { Module } from '@nestjs/common';

import { Encrypter } from '@/domain/forum/application/cryptography/encrypter';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';

import { JwtEncrypter } from './jwt-encrypter';
import { BCryptHasher } from './bcrypt-hasher';

@Module({
  providers: [
    { provide: Encrypter, useClass: JwtEncrypter },
    { provide: HashComparer, useClass: BCryptHasher },
    { provide: HashGenerator, useClass: BCryptHasher },
  ],
  exports: [Encrypter, HashComparer, HashGenerator],
})
export class CryptographyModule {}
