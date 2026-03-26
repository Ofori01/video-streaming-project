import React, { useState, useCallback } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import {
  Upload,
  X,
  Film,
  Image as ImageIcon,
  CheckCircle2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { useCreateVideo } from "@/hooks/mutations/useVideoMutations";
import { useGetAllVideoCategories } from "@/hooks/queries/useVideoQuerries";
import videoService from "@/backend/video.service";
import { toast } from "sonner";
import type { ApiErrorResponse } from "@/types/errors";
import { Progress } from "@/components/ui/progress";
import { uploadWithRetry } from "@/lib/upload/uploadWithRetry";
import { useDispatch } from "react-redux";
import { startProcessingTracking } from "@/store/uploadProcessing/uploadProcessingSlice";
import {
  initialMovieFormValues,
  movieCreateValidationSchema,
  type MovieFormValues,
} from "./movie-create/form";

const MovieCreate: React.FC = () => {
  const dispatch = useDispatch();
  const createVideoMutation = useCreateVideo();
  const { data: categories = [], isLoading: isCategoriesLoading } =
    useGetAllVideoCategories();

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const [uploadSessionId, setUploadSessionId] = useState<number | null>(null);
  const [uploadSessionExpiresAt, setUploadSessionExpiresAt] = useState<
    string | null
  >(null);
  const [videoUploadPercent, setVideoUploadPercent] = useState(0);
  const [thumbnailUploadPercent, setThumbnailUploadPercent] = useState(0);
  const [isUploadingToS3, setIsUploadingToS3] = useState(false);
  const [isVideoUploaded, setIsVideoUploaded] = useState(false);
  const [isThumbnailUploaded, setIsThumbnailUploaded] = useState(false);

  const resetUploadState = useCallback(() => {
    setUploadSessionId(null);
    setUploadSessionExpiresAt(null);
    setVideoUploadPercent(0);
    setThumbnailUploadPercent(0);
    setIsUploadingToS3(false);
    setIsVideoUploaded(false);
    setIsThumbnailUploaded(false);
  }, []);

  const beginDirectUpload = useCallback(
    async (videoFile: File, thumbnailFile: File) => {
      resetUploadState();
      setIsUploadingToS3(true);

      try {
        const uploadSession = await videoService.createUploadSession({
          video: {
            fileName: videoFile.name,
            contentType: videoFile.type,
            size: videoFile.size,
          },
          thumbnail: {
            fileName: thumbnailFile.name,
            contentType: thumbnailFile.type,
            size: thumbnailFile.size,
          },
        });

        setUploadSessionId(uploadSession.uploadSessionId);
        setUploadSessionExpiresAt(uploadSession.expiresAt);

        await Promise.all([
          uploadWithRetry({
            presignedPostData: uploadSession.video,
            file: videoFile,
            onProgress: (progress) => setVideoUploadPercent(progress),
            label: "video",
            uploadFn: videoService.uploadFileToS3,
          }).then(() => setIsVideoUploaded(true)),
          uploadWithRetry({
            presignedPostData: uploadSession.thumbnail,
            file: thumbnailFile,
            onProgress: (progress) => setThumbnailUploadPercent(progress),
            label: "thumbnail",
            uploadFn: videoService.uploadFileToS3,
          }).then(() => setIsThumbnailUploaded(true)),
        ]);

        toast.success("Files uploaded", {
          description:
            "Video and thumbnail uploaded to cloud storage successfully.",
        });
      } catch (error) {
        const uploadError = error as Error;
        resetUploadState();
        toast.error("Upload failed", {
          description:
            uploadError.message ||
            "Service may be temporarily unavailable. Please wait and try again.",
        });
      } finally {
        setIsUploadingToS3(false);
      }
    },
    [resetUploadState],
  );

  const handleVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    thumbnail: File | null,
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      resetUploadState();
      setFieldValue("video", file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);

      if (thumbnail) {
        void beginDirectUpload(file, thumbnail);
      }
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void,
    video: File | null,
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      resetUploadState();
      setFieldValue("thumbnail", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      if (video) {
        void beginDirectUpload(video, file);
      }
    }
  };

  const clearVideo = (
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    resetUploadState();
    setFieldValue("video", null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
  };

  const clearThumbnail = (
    setFieldValue: (field: string, value: unknown) => void,
  ) => {
    resetUploadState();
    setFieldValue("thumbnail", null);
    setThumbnailPreview(null);
  };

  const handleSubmit = async (
    values: MovieFormValues,
    { setSubmitting, resetForm }: FormikHelpers<MovieFormValues>,
  ) => {
    try {
      if (!uploadSessionId || !isVideoUploaded || !isThumbnailUploaded) {
        toast.error("Upload incomplete", {
          description:
            "Please upload both video and thumbnail successfully before submitting.",
        });
        return;
      }

      const createdVideo = await createVideoMutation.mutateAsync({
        title: values.title,
        description: values.description,
        categoryId: Number(values.category),
        uploadSessionId,
      });

      dispatch(
        startProcessingTracking({
          videoId: createdVideo.id,
          title: values.title,
        }),
      );

      toast.success("Movie uploaded successfully!", {
        description: `"${values.title}" is being processed. Track it from the floating status widget.`,
        icon: <CheckCircle2 className="w-5 h-5 text-green-500" />,
      });

      setTimeout(() => {
        resetForm();
        setVideoPreview(null);
        setThumbnailPreview(null);
        resetUploadState();
      }, 1000);
    } catch (error) {
      console.error("Upload failed:", error);

      const apiError = error as ApiErrorResponse;
      const errorMessage =
        apiError?.message ||
        "There was an error uploading your movie. Please try again.";

      const fieldErrors = apiError?.errors
        ? apiError.errors
            .map((err) => `${err.field}: ${err.message}`)
            .join(", ")
        : null;

      toast.error("Upload failed", {
        description: fieldErrors || errorMessage,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-15 pt-2 pb-4 px-2 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-destructive mb-2">
          Upload Movie
        </h1>
        <p className="text-muted-foreground">
          Upload a new movie to your streaming platform
        </p>
      </div>

      <Formik
        initialValues={initialMovieFormValues}
        validationSchema={movieCreateValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, setFieldValue, isSubmitting }) => (
          <Form>
            <FieldGroup>
              <Card>
                <CardHeader>
                  <CardTitle>Movie Details</CardTitle>
                  <CardDescription>
                    Provide information about the movie
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <Label htmlFor="title">Title *</Label>
                      <Input
                        id="title"
                        name="title"
                        value={values.title}
                        onChange={(e) => setFieldValue("title", e.target.value)}
                        aria-invalid={touched.title && !!errors.title}
                        placeholder="Enter movie title"
                      />
                      {touched.title && errors.title && (
                        <span className="text-sm text-destructive">
                          {errors.title}
                        </span>
                      )}
                    </Field>

                    <Field>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={values.category}
                        onValueChange={(value) =>
                          setFieldValue("category", value)
                        }
                      >
                        <SelectTrigger
                          id="category"
                          className="w-full"
                          aria-invalid={touched.category && !!errors.category}
                        >
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {isCategoriesLoading ? (
                            <SelectItem value="loading" disabled>
                              Loading categories...
                            </SelectItem>
                          ) : categories.length === 0 ? (
                            <SelectItem value="no-categories" disabled>
                              No categories available
                            </SelectItem>
                          ) : (
                            categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          )}
                        </SelectContent>
                      </Select>
                      {touched.category && errors.category && (
                        <span className="text-sm text-destructive">
                          {errors.category}
                        </span>
                      )}
                    </Field>

                    <Field>
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={values.description}
                        onChange={(e) =>
                          setFieldValue("description", e.target.value)
                        }
                        aria-invalid={
                          touched.description && !!errors.description
                        }
                        placeholder="Enter movie description"
                        className="min-h-32"
                      />
                      {touched.description && errors.description && (
                        <span className="text-sm text-destructive">
                          {errors.description}
                        </span>
                      )}
                    </Field>
                  </FieldGroup>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Video File</CardTitle>
                  <CardDescription>
                    Upload the movie file (MP4, WebM, OGG - Max 500MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Field>
                    {!values.video ? (
                      <label
                        htmlFor="video-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors border-input"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Film className="w-12 h-12 mb-3 text-destructive" />
                          <p className="mb-2 text-sm font-medium">
                            Click to upload video
                          </p>
                          <p className="text-xs text-muted-foreground">
                            MP4, WebM, OGG (MAX. 500MB)
                          </p>
                        </div>
                        <Input
                          id="video-upload"
                          type="file"
                          className="hidden"
                          accept="video/mp4,video/webm,video/ogg,video/quicktime"
                          onChange={(e) =>
                            handleVideoChange(
                              e,
                              setFieldValue,
                              values.thumbnail,
                            )
                          }
                        />
                      </label>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 border rounded-lg border-input bg-accent/20">
                          <div className="flex items-center space-x-3">
                            <Film className="w-8 h-8 text-destructive" />
                            <div>
                              <p className="font-medium text-sm">
                                {values.video.name}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {(values.video.size / (1024 * 1024)).toFixed(2)}{" "}
                                MB
                              </p>
                            </div>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => clearVideo(setFieldValue)}
                          >
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    )}
                    {touched.video && errors.video && (
                      <span className="text-sm text-destructive">
                        {errors.video}
                      </span>
                    )}
                  </Field>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Thumbnail Image</CardTitle>
                  <CardDescription>
                    Upload a thumbnail for the movie (JPG, PNG, WebP - Max 5MB)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Field>
                    {!values.thumbnail ? (
                      <label
                        htmlFor="thumbnail-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50 transition-colors border-input"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <ImageIcon className="w-12 h-12 mb-3 text-destructive" />
                          <p className="mb-2 text-sm font-medium">
                            Click to upload thumbnail
                          </p>
                          <p className="text-xs text-muted-foreground">
                            JPG, PNG, WebP (MAX. 5MB)
                          </p>
                        </div>
                        <Input
                          id="thumbnail-upload"
                          type="file"
                          className="hidden"
                          accept="image/jpeg,image/png,image/webp,image/jpg"
                          onChange={(e) =>
                            handleThumbnailChange(
                              e,
                              setFieldValue,
                              values.video,
                            )
                          }
                        />
                      </label>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          {thumbnailPreview && (
                            <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-input">
                              <img
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                className="w-full h-full object-cover"
                              />
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon-sm"
                                className="absolute top-2 right-2"
                                onClick={() => clearThumbnail(setFieldValue)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          )}
                          <p className="text-sm text-muted-foreground mt-2">
                            {values.thumbnail.name} (
                            {(values.thumbnail.size / 1024).toFixed(2)} KB)
                          </p>
                        </div>
                      </div>
                    )}
                    {touched.thumbnail && errors.thumbnail && (
                      <span className="text-sm text-destructive">
                        {errors.thumbnail}
                      </span>
                    )}
                  </Field>
                </CardContent>
              </Card>

              {(isUploadingToS3 || uploadSessionId !== null) && (
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Upload Progress</CardTitle>
                    <CardDescription>
                      Uploading files cloud storage
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Video Upload
                        </span>
                        <span>{videoUploadPercent}%</span>
                      </div>
                      <Progress value={videoUploadPercent} className="h-2" />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">
                          Thumbnail Upload
                        </span>
                        <span>{thumbnailUploadPercent}%</span>
                      </div>
                      <Progress
                        value={thumbnailUploadPercent}
                        className="h-2"
                      />
                    </div>

                    {uploadSessionExpiresAt && (
                      <p className="text-xs text-muted-foreground">
                        Upload session expires at{" "}
                        {new Date(uploadSessionExpiresAt).toLocaleTimeString()}.
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setFieldValue("title", "");
                    setFieldValue("description", "");
                    setFieldValue("category", "");
                    clearVideo(setFieldValue);
                    clearThumbnail(setFieldValue);
                    resetUploadState();
                  }}
                  disabled={isSubmitting || isUploadingToS3}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={
                    isSubmitting ||
                    isUploadingToS3 ||
                    !uploadSessionId ||
                    !isVideoUploaded ||
                    !isThumbnailUploaded
                  }
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-pulse" />
                      Publishing...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Publish Movie
                    </>
                  )}
                </Button>
              </div>
            </FieldGroup>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default MovieCreate;
