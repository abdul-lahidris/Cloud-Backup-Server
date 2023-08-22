import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne } from 'typeorm';
import { UserFile } from './file.entity';
import Model from './model.entity';
import { User } from './user.entity';

@Entity('folders')
export class Folder extends Model {

  @Column()
  name: string;

  @ManyToOne(() => User, user => user.folders)
  user: User;

  @OneToMany(() => UserFile, file => file.folder)
  files: UserFile[];
}