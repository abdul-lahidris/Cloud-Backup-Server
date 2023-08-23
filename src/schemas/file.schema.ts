import { object, string, TypeOf } from 'zod';

export const createFileSchema = object({
  body: object({
    // name: string({
    //   required_error: 'Name is required',
    // }),
    folderId: string(),
    userId: string({
      required_error: 'file owner {userId} is required',
    }),
  }),
});

const params = {
  params: object({
    fileId: string(),
  }),
};


export const getFileByIdSchema = object({
    ...params
  });

  export const getFileByUserIdSchema = object({
    params: object({
      userId: string(),
    }),
  });
export const updateFileSchema = object({
  ...params,
  body: object({
    name: string(),
    folderId: string(),
    userId: string(),
  }).partial(),
});

export const deleteFileSchema = object({
  ...params,
});

export type CreateFileInput = TypeOf<typeof createFileSchema>['body'];
export type GetFileInput = TypeOf<typeof getFileByIdSchema>['params'];
export type GetUserFilesInput = TypeOf<typeof getFileByUserIdSchema>['params'];
export type UpdateFileInput = TypeOf<typeof updateFileSchema>;
export type DeleteFileInput = TypeOf<typeof deleteFileSchema>['params'];
