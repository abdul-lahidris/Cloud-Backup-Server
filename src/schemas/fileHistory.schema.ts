import { object, string, TypeOf } from 'zod';


export const getHistoryByFileIdSchema = object({
    params: object({
        fileId: string(),
    }),
});

export const getUserFileHistorySchema = object({
    params: object({
        userId: string(),
    }),
});


export type GetHistoryByFileIdInput = TypeOf<typeof getHistoryByFileIdSchema>['params'];
export type GetUserFileHistoryInput = TypeOf<typeof getUserFileHistorySchema>['params'];
