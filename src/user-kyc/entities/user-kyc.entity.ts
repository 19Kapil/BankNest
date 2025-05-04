import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('UserKYC')
export class UserKYCEntity {
  @PrimaryGeneratedColumn()
  kycId: number;

  @Column({ unique: true })
  userId: number;

  @Column()
  fullName: string;

  @Column()
  gender: string;

  @Column({ type: 'date' })
  DOB: Date;

  @Column()
  fatherName: string;

  @Column()
  motherName: string;

  @Column()
  maritalStatus: string;

  @Column()
  occupation: string;

  @Column({ unique: true })
  mobileNumber: string;

  @Column()
  currentAddress: string;

  @Column()
  permanentAddress: string;

  @Column()
  profilePhoto: string;

  @Column()
  citizenshipPhoto: string;

  @Column()
  documentType: string;

  @Column({ unique: true })
  citizenshipNumber: string;

  @Column({ type: 'date' })
  issueDate: Date;

  @Column()
  issueDistrict: string;

  @Column({ default: false })
  isVerified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
