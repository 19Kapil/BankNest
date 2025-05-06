import { Roles } from 'src/utility/common/user-roles.enum';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Timestamp,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('User')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  password: string;
  @Column({ type: 'enum', enum: Roles, array: true, default: [Roles.USER] })
  role: Roles[];
  @CreateDateColumn()
  createdAt: Timestamp;
  @UpdateDateColumn()
  updatedAt: Timestamp;
  @Column({ default: false })
  isVerified: boolean;
}
