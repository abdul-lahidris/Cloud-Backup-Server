import { Entity, Column, ManyToOne} from 'typeorm';
import Model from './model.entity';
import { User } from './user.entity'; // Import your User model here


@Entity()
export class FileApproval  extends Model {
    @ManyToOne(() => User)
    user: User;

    @Column()
    fileId: string; // Foreign key to the file

    @Column()
    userId: string; // Foreign key to the file

    @Column()
    approvalNumber: number; // The position of the approval
}
