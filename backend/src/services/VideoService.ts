import { AppDataSource } from "../config/db.config";
import { CategoryEntity } from "../entities/CategoryEntity";
import { FileEntity } from "../entities/FilesEntity";
import { UserEntity } from "../entities/UserEntity";
import { VideoEntity } from "../entities/VideoEntity";
import { UploadFiles } from "../interfaces/common/Files";
import { CreateVideoDto } from "../interfaces/dtos/video-dtos";
import { IVideoRepository } from "../interfaces/repositories/IVideoRepository";
import { IVideoService } from "../interfaces/services/IVideoService";
import { FILE_TYPE } from "../lib/types/common/enums";
import { NotFoundError } from "../middlewares/errorHandler/errors/NotFoundError";
import { GenericService } from "./GenericService";

export class VideoService
  extends GenericService<VideoEntity>
  implements IVideoService
{
  constructor(
    protected videoRepository: IVideoRepository
  ) // private _categoryRepository: ICategoryRepository
  {
    super(videoRepository);
  }

  CreateVideo(dto: CreateVideoDto, files: UploadFiles): Promise<VideoEntity> {
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
      const fileRepo = transactionManager.getRepository(FileEntity);

      const thumbnail = fileRepo.create({
        type: FILE_TYPE.THUMBNAIL,
        url: 'uploads/'+files.thumbnail?.[0].filename
      });
      const video = fileRepo.create({
        type: FILE_TYPE.VIDEO,
        url: 'uploads/'+files.video?.[0].filename,
      });

      await fileRepo.save([thumbnail, video]);

      const newVideo = videoRepo.create({
        title: dto.title,
        description: dto.description,
        category: Category,
        uploadedBy: uploader,
        thumbnail: thumbnail,
        video: video,
      });
      await videoRepo.save(newVideo);

      return await videoRepo.findOneOrFail({
        where: {
          id: newVideo.id,
        },
        relations: {
          thumbnail: true,
          video: true,
          category: true,
          uploadedBy: true,
        },
        select: {
          uploadedBy: {
            password: false,
            username: true,
            id: true
          }
        }
      });
    });
  }
}
