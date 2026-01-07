import type { Response } from 'express';
import { pagination } from '../../interfaces/common/Pagination';

export interface SuccessResponse<T = any> {
    message: string;
    data?: T;
    pagination?:pagination
    meta?: Record<string, any>;
    timestamp: string;
}

class CustomResponse {
    private static _instance: CustomResponse;

    private constructor() {}

    public static getInstance() {
        if (!CustomResponse._instance) {
            CustomResponse._instance = new CustomResponse();
        }
        return CustomResponse._instance;
    }

    
    success<T>(
        res: Response,
        data?: T,
        message: string = 'Request successful',
        statusCode: number = 200,
        meta?: Record<string, any>
    ) {
        const response: SuccessResponse<T> = {
            message,
            data,
            timestamp: new Date().toISOString()
        };

        if (meta) {
            response.meta = meta;
        }

        return res.status(statusCode).json(response);
    }

    
    successWithPagination<T>(
        res: Response,
        data: T,
        pagination: pagination,
        message: string = 'Request successful',
        statusCode: number = 200
    ) {
        const response: SuccessResponse<T> = {
            message,
            data,
            pagination,
            timestamp: new Date().toISOString()
        };

        return res.status(statusCode).json(response);
    }

    
    created<T>(
        res: Response,
        data: T,
        message: string = 'Resource created successfully'
    ) {
        return this.success(res, data, message, 201);
    }

    
    updated<T>(
        res: Response,
        data: T,
        message: string = 'Resource updated successfully'
    ) {
        return this.success(res, data, message, 200);
    }

    
    deleted(
        res: Response,
        message: string = 'Resource deleted successfully'
    ) {
        const response: SuccessResponse = {
            message,
            timestamp: new Date().toISOString()
        };

        return res.status(200).json(response);
    }

    
    noContent(res: Response) {
        return res.status(204).send();
    }
}
const responseHandler = CustomResponse.getInstance()
export default responseHandler