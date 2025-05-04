import {
    IsString,
    IsDate,
    IsBoolean,
    IsNotEmpty,
    IsOptional,
    IsMobilePhone,
    IsNumber,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  export class CreateUserKycDto {
    @IsString()
    @IsNotEmpty()
    fullName: string;
  
    @IsString()
    @IsNotEmpty()
    gender: string;
  
    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    DOB: Date;
  
    @IsString()
    @IsNotEmpty()
    fatherName: string;
  
    @IsString()
    @IsNotEmpty()
    motherName: string;
  
    @IsString()
    @IsNotEmpty()
    maritalStatus: string;
  
    @IsString()
    @IsNotEmpty()
    occupation: string;
  
    @IsMobilePhone()
    @IsNotEmpty()
    mobileNumber: string;
  
    @IsString()
    @IsNotEmpty()
    currentAddress: string;
  
    @IsString()
    @IsNotEmpty()
    permanentAddress: string;
  
  
    @IsString()
    @IsNotEmpty()
    documentType: string;
  
    @IsString()
    @IsNotEmpty()
    citizenshipNumber: string;
  
    @Type(() => Date)
    @IsNotEmpty()
    @IsDate()
    issueDate: Date;
  
    @IsString()
    @IsNotEmpty()
    issueDistrict: string;
  }
  