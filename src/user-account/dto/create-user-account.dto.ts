import { IsNotEmpty, IsString } from "class-validator";
import { AccountType } from "src/utility/common/accountType.enum";

export class CreateUserAccountDto {

@IsString()
@IsNotEmpty()
accountName: string;

@IsNotEmpty()
@IsString()
accountType: AccountType;

}
