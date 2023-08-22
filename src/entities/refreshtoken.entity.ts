import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";
import Model from "./model.entity";

@Entity('refreshTokens')
export class RefreshToken extends Model {
  @Column()
  token: string;

  @Column()
  expires: Date;

  @Column()
  createdByIp: string;

  @Column()
  revoked?: Date;

  @Column()
  replacedByToken: string;

//   @Column()
//   isExpired: boolean;

//   @Column()
//   isActive: boolean;
}
