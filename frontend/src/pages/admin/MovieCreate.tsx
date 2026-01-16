import React, { useState } from "react";
import { Formik, Form, type FormikHelpers } from "formik";
import * as Yup from "yup";
import { Upload, X, Film, Image as ImageIcon } from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";

interface MovieFormValues {
  title: string;
  description: string;
  category: string;
  video: File | null;
  thumbnail: File | null;
}

interface UploadProgress {
  video: number;
  thumbnail: number;
}

const validationSchema = Yup.object({
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
      return (
        value &&
        ["video/mp4", "video/webm", "video/ogg", "video/quicktime"].includes(
          (value as File).type
        )
      );
    }),
  thumbnail: Yup.mixed()
    .required("Thumbnail is required")
    .test("fileSize", "Thumbnail is too large (max 5MB)", (value) => {
      return value && (value as File).size <= 5 * 1024 * 1024;
    })
    .test("fileType", "Only image files are allowed", (value) => {
      return (
        value &&
        ["image/jpeg", "image/png", "image/webp", "image/jpg"].includes(
          (value as File).type
        )
      );
    }),
});

const MovieCreate: React.FC = () => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    video: 0,
    thumbnail: 0,
  });
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  // Mock categories - these would come from backend
  const categories = [
    { id: "1", name: "Action" },
    { id: "2", name: "Comedy" },
    { id: "3", name: "Drama" },
    { id: "4", name: "Horror" },
    { id: "5", name: "Sci-Fi" },
  ];

  const initialValues: MovieFormValues = {
    title: "",
    description: "",
    category: "",
    video: null,
    thumbnail: null,
  };

  const handleVideoChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("video", file);
      const url = URL.createObjectURL(file);
      setVideoPreview(url);
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    const file = event.currentTarget.files?.[0];
    if (file) {
      setFieldValue("thumbnail", file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearVideo = (
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    setFieldValue("video", null);
    if (videoPreview) {
      URL.revokeObjectURL(videoPreview);
      setVideoPreview(null);
    }
    setUploadProgress((prev) => ({ ...prev, video: 0 }));
  };

  const clearThumbnail = (
    setFieldValue: (field: string, value: unknown) => void
  ) => {
    setFieldValue("thumbnail", null);
    setThumbnailPreview(null);
    setUploadProgress((prev) => ({ ...prev, thumbnail: 0 }));
  };

  const handleSubmit = async (
    values: MovieFormValues,
    { setSubmitting, resetForm }: FormikHelpers<MovieFormValues>
  ) => {
    try {
      // Create FormData for multipart upload
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("description", values.description);
      formData.append("category", values.category);
      if (values.video) formData.append("video", values.video);
      if (values.thumbnail) formData.append("thumbnail", values.thumbnail);

      // TODO: Replace with actual API call
      // Simulate upload progress
      const simulateUpload = () => {
        return new Promise((resolve) => {
          let progress = 0;
          const interval = setInterval(() => {
            progress += 10;
            setUploadProgress({ video: progress, thumbnail: progress });
            if (progress >= 100) {
              clearInterval(interval);
              resolve(true);
            }
          }, 300);
        });
      };

      await simulateUpload();

      console.log("Form submitted:", values);
      // Reset form after successful upload
      resetForm();
      setVideoPreview(null);
      setThumbnailPreview(null);
      setUploadProgress({ video: 0, thumbnail: 0 });
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-destructive mb-2">
          Upload Movie
        </h1>
        <p className="text-muted-foreground">
          Upload a new movie to your streaming platform
        </p>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
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
                    {/* Title Field */}
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

                    {/* Category Field */}
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
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {touched.category && errors.category && (
                        <span className="text-sm text-destructive">
                          {errors.category}
                        </span>
                      )}
                    </Field>

                    {/* Description Field */}
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

              {/* Video Upload Card */}
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
                          onChange={(e) => handleVideoChange(e, setFieldValue)}
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
                        {uploadProgress.video > 0 &&
                          uploadProgress.video < 100 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span className="text-destructive font-medium">
                                  {uploadProgress.video}%
                                </span>
                              </div>
                              <Progress
                                value={uploadProgress.video}
                                className="h-2"
                              />
                            </div>
                          )}
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

              {/* Thumbnail Upload Card */}
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
                            handleThumbnailChange(e, setFieldValue)
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
                        {uploadProgress.thumbnail > 0 &&
                          uploadProgress.thumbnail < 100 && (
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span>Uploading...</span>
                                <span className="text-destructive font-medium">
                                  {uploadProgress.thumbnail}%
                                </span>
                              </div>
                              <Progress
                                value={uploadProgress.thumbnail}
                                className="h-2"
                              />
                            </div>
                          )}
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

              {/* Submit Button */}
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
                  }}
                  disabled={isSubmitting}
                >
                  Clear
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={isSubmitting}
                  className="min-w-32"
                >
                  {isSubmitting ? (
                    <>
                      <Upload className="w-4 h-4 mr-2 animate-pulse" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Movie
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
