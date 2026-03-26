import * as Yup from "yup";

export interface MovieFormValues {
  title: string;
  description: string;
  category: string;
  video: File | null;
  thumbnail: File | null;
}

export const initialMovieFormValues: MovieFormValues = {
  title: "",
  description: "",
  category: "",
  video: null,
  thumbnail: null,
};

const videoMimeTypes = [
  "video/mp4",
  "video/webm",
  "video/ogg",
  "video/quicktime",
];

const thumbnailMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/jpg",
];

export const movieCreateValidationSchema = Yup.object({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  description: Yup.string()
    .required("Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description must not exceed 1000 characters"),
  category: Yup.string().required("Category is required"),
  video: Yup.mixed()
    .required("Video file is required")
    .test("fileSize", "Video file is too large (max 500MB)", (value) => {
      return value && (value as File).size <= 500 * 1024 * 1024;
    })
    .test("fileType", "Only video files are allowed", (value) => {
      return value && videoMimeTypes.includes((value as File).type);
    }),
  thumbnail: Yup.mixed()
    .required("Thumbnail is required")
    .test("fileSize", "Thumbnail is too large (max 5MB)", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only image files are allowed", (value) => {
      return value && thumbnailMimeTypes.includes((value as File).type);
    }),
});
