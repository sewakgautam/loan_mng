export const defaultPaginationOption = (
    option: { page?: number; capacity?: number },
    maxCap = 50,
) => {
    return {
        page: option.page ?? 1,
        capacity: Math.min(option.capacity ?? maxCap, maxCap),
    };
};
