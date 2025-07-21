import { Attachment } from '@/domain/forum/enterprise/entities';
import { InMemoryAttachmentssRepository } from 'test/repositories/forum/in-memory-attachments.repository';
import { UploadAndCreateAttachmentUseCase } from './upload-and-create-attachment';
import { FakeUploader } from 'test/storage/fake-uploader';
import { InvalidAttachmentTypeError } from '../../errors';

describe('UploadAndCreateAttachmentUseCase', () => {
  let repository: InMemoryAttachmentssRepository;
  let sut: UploadAndCreateAttachmentUseCase;
  let fakeUploader: FakeUploader;

  beforeEach(() => {
    repository = new InMemoryAttachmentssRepository();
    fakeUploader = new FakeUploader();

    sut = new UploadAndCreateAttachmentUseCase(repository, fakeUploader);
  });

  it('should be able to upload and create an attachment', async () => {
    const result = await sut.execute({
      fileName: 'profile.png',
      fileType: 'image/png',
      body: Buffer.from(''),
    });

    const { attachment } = result.value as { attachment: Attachment };
    const [item] = repository.items;

    expect(result.isRight()).toBeTruthy();
    expect(attachment).toEqual(item);
    expect(fakeUploader.uploads).toHaveLength(1);
    expect(fakeUploader.uploads[0]).toEqual(
      expect.objectContaining({
        fileName: 'profile.png',
      }),
    );
  });

  it('should not be able to upload an attachment with an invalid file type', async () => {
    const result = await sut.execute({
      fileName: 'invalid-file.mp3',
      fileType: 'audio/mpeg',
      body: Buffer.from(''),
    });

    expect(result.isLeft()).toBeTruthy();
    expect(result.value).toBeInstanceOf(InvalidAttachmentTypeError);
  });
});
