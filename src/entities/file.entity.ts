import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Folder } from './folder.entity';
import Model from './model.entity';
import { User } from './user.entity';

@Entity('userFiles')
export class UserFile extends Model {

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.files)
  user: User;

  @ManyToOne(() => Folder, folder => folder.files, { nullable: true })
  folder: Folder;
}