import { object, string, TypeOf } from 'zod';

export const createFolderSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    folderId: string(),
    userId: string({
      required_error: 'folder owner {userId} is required',
    }),
  }),
});

const params = {
  params: object({
    folderId: string(),
  }),
};


export const getFolderByIdSchema = object({
    ...params
  });

  export const getFolderByUserIdSchema = object({
    params: object({
      userId: string(),
    }),
  });
export const updateFolderSchema = object({
  ...params,
  body: object({
    name: string(),
    path: string(),
    userId: string(),
  }).partial(),
});

export const deleteFolderSchema = object({
  ...params,
});

export type CreateFolderInput = TypeOf<typeof createFolderSchema>['body'];
export type GetFolderInput = TypeOf<typeof getFolderByIdSchema>['params'];
export type GetUserFoldersInput = TypeOf<typeof getFolderByUserIdSchema>['params'];
export type UpdateFolderInput = TypeOf<typeof updateFolderSchema>;
export type DeleteFolderInput = TypeOf<typeof deleteFolderSchema>['params'];
