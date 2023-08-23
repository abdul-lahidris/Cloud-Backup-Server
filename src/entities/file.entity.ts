import { Entity, Index, Column, ManyToOne } from 'typeorm';
import { Folder } from './folder.entity';
import Model from './model.entity';
import { User } from './user.entity';
import config from 'config';

@Entity('userFiles')
export class UserFile extends Model {
  @Index('file_name_index')
  @Column()
  name: string;

  @Column()
  url: string;

  @Column()
  userId: string;

  @Column()
  folderId: string;

  @Column({default: false})
  isUnsafe: boolean;

  @ManyToOne(() => User, user => user.files)
  user: User;

  @ManyToOne(() => Folder, folder => folder.files, { nullable: true })
  folder: Folder;

  streamLink: string = '';
}