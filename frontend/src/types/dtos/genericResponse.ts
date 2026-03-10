

export interface ApiSuccessResponse<T>{
    success: boolean
    message: string
    data: T
}

export interface ApiPaginatedResponse<T>{
    success: boolean;
    message : string
    data: T[]
    pagination: PaginationMeta
}
export interface PaginationMeta{
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
}