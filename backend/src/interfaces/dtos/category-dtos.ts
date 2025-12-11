import { InferType, object, string } from "yup";



const CreateCategoryBodySchema = object({
  name: string()
    .required("Enter the category name")
    .length(50, "Category name must not be more than 50 characters"),
  description: string()
    .required("Enter the description")
    .length(255, "Must not be more than 255 characters"),
});

export const CreateCategorySchema = object({
    body: CreateCategoryBodySchema
})

export interface CreateCategoryDto extends InferType<typeof CreateCategoryBodySchema>{}


