import swaggerJSDoc from "swagger-jsdoc";

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.1.0",
    info: {
      title: "A video streaming API with Express",
      version: "0.1.0",
      description:
        "CRUD API for video streaming and uploading built with Express.",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "Ofori",
        email: "info@email.com",
      },
    },
    servers: [{ url: "http://localhost:5000/api" }],
    tags: [{ name: "Videos", description: "Video management endpoints" }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        ErrorItem: {
          type: "object",
          properties: {
            message: { type: "string", example: "Title is required" },
            field: { type: "string", example: "title" },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            success: { type: "boolean", example: false },
            message: { type: "string", example: "Validation failed" },
            errors: {
              type: "array",
              items: { $ref: "#/components/schemas/ErrorItem" },
              nullable: true,
            },
          },
          required: ["success", "message"],
        },
        MediaAsset: {
          type: "object",
          properties: {
            id: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            url: { type: "string", format: "uri" },
            type: { type: "string", enum: ["thumbnail", "video"] },
          },
          required: ["id", "url", "type", "createdAt", "updatedAt"],
        },
        Category: {
          type: "object",
          properties: {
            id: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            name: { type: "string" },
            description: { type: "string" },
          },
          required: ["id", "name", "createdAt", "updatedAt"],
        },
        UploadedBy: {
          type: "object",
          properties: {
            id: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            username: { type: "string" },
            email: { type: "string" },
          },
          required: ["id", "username", "email", "createdAt", "updatedAt"],
        },

        Video: {
          type: "object",
          properties: {
            id: { type: "number" },
            createdAt: { type: "string", format: "date-time" },
            updatedAt: { type: "string", format: "date-time" },
            title: { type: "string" },
            description: { type: "string" },
            duration: { type: "number", nullable: true },
            processingError: { type: "string", nullable: true },
            status: {
              type: "string",
              enum: ["archived", "published", "draft"],
            },
            processingStatus: {
              type: "string",
              enum: ["pending", "processing", "completed", "failed"],
            },
            category: { $ref: "#/components/schemas/Category" },
            uploadedBy: { $ref: "#/components/schemas/UploadedBy" },
            thumbnail: { $ref: "#/components/schemas/MediaAsset" },
            video: { $ref: "#/components/schemas/MediaAsset" },
          },
          required: [
            "id",
            "title",
            "description",
            "status",
            "processingStatus",
            "createdAt",
            "updatedAt",
            "category",
            "uploadedBy",
            "thumbnail",
            "video",
          ],
        },
        CreateVideoInput: {
          type: "object",
          properties: {
            title: { type: "string" },
            description: { type: "string" },
            categoryId: { type: "number" },
            thumbnail: { type: "string", format: "binary" },
            video: { type: "string", format: "binary" },
          },
          required: [
            "description",
            "title",
            "video",
            "thumbnail",
            "categoryId",
          ],
        },
        VideoResponse: {
          type: "object",
          properties: {
            data: { $ref: "#/components/schemas/Video" },
            success: { type: "boolean", example: true },
            message: { type: "string", nullable: true },
          },
          required: ["data"],
        },
        VideosListResponse: {
          type: "object",
          properties: {
            data: {
              type: "array",
              items: {$ref: '#/components/schemas/Video'},
              message: { type: "string", nullable: true }
            },
            timestamp: "date-time"
          },
          required: ['data'],
          example: {
            data: [
              {
                id: 12,
                title: "Js tutorials",
                description: "Introduction to javascript",
                status: "archived",
                processingStatus: "pending",
                category: { id: 3, name: "Sports" },
                uploadedBy: { id: 12, username: "testUser9", email: "testemail9" },
                thumbnail: { id: 21, url: "https://...", type: "thumbnail" },
                video: { id: 22, url: "https://...", type: "video" },
                createdAt: "2025-12-17T15:47:42.341Z",
                updatedAt: "2025-12-17T15:47:42.341Z"
              }
            ],
            message: null
          }
        },
        
      },
      responses: {
        BadRequest: {
          description:
            "Invalid or malformed request (validation, multer errors).",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                validation: {
                  value: {
                    success: false,
                    message: "Validation failed",
                    errors: [
                      { message: "Title is required", field: "title" },
                      { message: "File must be a video", field: "file" },
                    ],
                  },
                },
                upload: {
                  value: {
                    success: false,
                    message: "An error occurred while uploading",
                    errors: [{ message: "File too large", field: "file" }],
                  },
                },
              },
            },
          },
        },
        Unauthorized: {
          description: "Authentication failed or missing (JWT).",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              examples: {
                invalidToken: {
                  value: {
                    success: false,
                    message: "Invalid token",
                    errors: null,
                  },
                },
                expiredToken: {
                  value: {
                    success: false,
                    message: "Token expired",
                    errors: null,
                  },
                },
              },
            },
          },
        },
        Forbidden: {
          description: "Authenticated but not authorized for the resource.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                message: "Insufficient permissions",
                errors: null,
              },
            },
          },
        },
        NotFound: {
          description: "Resource not found.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                message: "Resource not found",
                errors: null,
              },
            },
          },
        },
        ServerError: {
          description: "Internal server error.",
          content: {
            "application/json": {
              schema: { $ref: "#/components/schemas/ErrorResponse" },
              example: {
                success: false,
                message: "Internal Server Error",
                errors: null,
              },
            },
          },
        },
      },
    },
  },
  apis: ["src/routes/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
