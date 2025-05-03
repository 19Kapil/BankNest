import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsNotEmpty({message: 'Email is required'})
    @IsEmail({}, {message: 'Email must be a valid email'})
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    password: string;
}
