import { hash, compare } from 'bcryptjs';
import { HashComparer } from '@/domain/forum/application/cryptography/hash-comparer';
import { HashGenerator } from '@/domain/forum/application/cryptography/hash-generator';

export class BCryptHasher implements HashGenerator, HashComparer {
  private readonly HASH_SALT_LENGTH = 8;

  hash(plain: string): Promise<string> {
    return hash(plain, this.HASH_SALT_LENGTH);
  }

  compare(plain: string, hashed: string): Promise<boolean> {
    return compare(plain, hashed);
  }
}
