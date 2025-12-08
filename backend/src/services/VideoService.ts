import { AppDataSource } from "../config/db.config";
import { CategoryEntity } from "../entities/CategoryEntity";
import { FileEntity } from "../entities/FilesEntity";
import { UserEntity } from "../entities/UserEntity";
import { VideoEntity } from "../entities/VideoEntity";
import { CreateVideoDto } from "../interfaces/dtos/video-dtos";
import { ICategoryRepository } from "../interfaces/repositories/ICategory";
import { IVideoRepository } from "../interfaces/repositories/IVideoRepository";
import { IVideoService } from "../interfaces/services/IVideoService";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import { GenericService } from "./GenericService";

export class VideoService
  extends GenericService<VideoEntity>
  implements IVideoService
{
  constructor(
    protected videoRepository: IVideoRepository,
    private _categoryRepository: ICategoryRepository
  ) {
    super(videoRepository);
  }

  CreateVideo(dto: CreateVideoDto): Promise<VideoEntity | null> {
    return AppDataSource.transaction(async (transactionManager) => {
      const Category = await transactionManager
        .getRepository(CategoryEntity)
        .findOne({ where: { id: dto.categoryId } });
      if (!Category) {
        throw new NotFoundError("Category not found");
      }
      const uploader = await transactionManager
        .getRepository(UserEntity)
        .findOne({ where: { id: dto.uploadedByUserId } });

      if (!uploader) {
        throw new NotFoundError("Uploaded By user not found");
      }
      const videoRepo = transactionManager.getRepository(VideoEntity);

      const video = videoRepo.create({
        title: dto.title,
        description: dto.description,
        status: dto.status,
        processingStatus: dto.processingStatus,
        category: Category,
        uploadedBy: uploader,
      });
      await videoRepo.save(video);

      //!for files -> would be a background job later
      if (dto.files?.length) {
        const fileRepo = transactionManager.getRepository(FileEntity);
        const files = dto.files.map((file) =>
          fileRepo.create({
            url: file.url,
            type: file.type,
            video: video,
          })
        );

        await fileRepo.save(files);
      }

      return await videoRepo.findOne({
        where: {
          id: video.id,
        },
        relations: {
          category: true,
          files: true,
          uploadedBy: true,
        },
      });
    });
  }
}
