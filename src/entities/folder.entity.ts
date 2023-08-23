import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, Index, TableForeignKey } from 'typeorm';
import { UserFile } from './file.entity';
import Model from './model.entity';
import { User } from './user.entity';

@Entity('folders')
export class Folder extends Model {

  @Index('folder_name_index')
  @Column()
  name: string;

  @Column()
  path: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, user => user.folders)
  user: User;

  @OneToMany(() => UserFile, file => file.folder)
  files: UserFile[];
}