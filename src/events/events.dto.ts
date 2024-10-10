import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateEventDto {
    @IsNotEmpty({ message: 'Planner cannot be empty' })
    planner: string;

    @IsNotEmpty({ message: 'location cannot be empty' })
    location: string;

    @IsNotEmpty({ message: 'title cannot be empty' })
    title: string;

    @IsNotEmpty({ message: 'type cannot be empty' })
    type: string;

    @IsNotEmpty()
    date: string

    @IsNotEmpty()
    time: string
}

export class UpdateEventDto {
    @IsNotEmpty({ message: 'Planner cannot be empty' })
    planner: string;

    @IsNotEmpty({ message: 'location cannot be empty' })
    location: string;

    @IsNotEmpty({ message: 'type cannot be empty' })
    type: string;

    @IsNotEmpty({ message: 'title cannot be empty' })
    title: string;

    @IsNotEmpty()
    date: string;

    @IsNotEmpty()
    time: string
}

export class RegisterEventDto {
    @IsNotEmpty({ message: 'name cannot be empty'})
    name: string

    @IsEmail({}, {message: 'invalid email'})
    @IsNotEmpty({ message: 'name cannot be empty'})
    email: string
    
}