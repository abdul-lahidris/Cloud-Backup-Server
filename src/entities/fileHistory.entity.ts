import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity'; // Import your User model here

export enum FileActionEnumType {
    UPLOAD = 'upload',
    RENAME = 'rename',
    COPY = 'copy',
    MOVE = 'move',
    DELETE = 'delete',
    UNSAFE = 'marked_unsafe',
  }

@Entity()
export class FileHistory extends Model {
    @ManyToOne(() => User)
    user: User;

    @Column()
    fileId: string; // Foreign key to the file

    @Column()
    userId: string; // Foreign key to the file

    @Column({
        type: 'enum',
        enum: FileActionEnumType,
      })
    actionType: FileActionEnumType; // E.g., 'upload', 'update', 'delete'

    @Column()
    remark: string; // E.g., 'file.pdf uploaded to /rppt/132fff2vcf32/school', 'update', 'delete'
}
