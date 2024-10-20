import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateEventDto {
    @ApiProperty({
        description: 'event planner name',
        example: 'Bloom'
    })
    @IsNotEmpty({ message: 'Planner cannot be empty' })
    planner: string;

    @ApiProperty({
        description: 'where the event will take place',
        example: 'ikeja city mall'
    })
    @IsNotEmpty({ message: 'location cannot be empty' })
    location: string;

    @ApiProperty({
        description: 'name of the event',
        example: 'Fij hangout'
    })
    @IsNotEmpty({ message: 'title cannot be empty' })
    title: string;

    @ApiProperty({
        description: 'type of event',
        example: 'entertainment'
    })
    @IsNotEmpty({ message: 'type cannot be empty' })
    type: string;

    @ApiProperty({
        description: 'when the event will take place',
        example: '2nd of may'
    })
    @IsNotEmpty()
    date: string

    @ApiProperty({
        description: 'time',
        example: '4pm'
    })
    @IsNotEmpty()
    time: string
}

export class UpdateEventDto {
    @ApiProperty({
        description: 'event planner name',
        example: 'Bloom'
    })
    @IsNotEmpty({ message: 'Planner cannot be empty' })
    planner: string;

    @ApiProperty({
        description: 'where the event will take place',
        example: 'ikeja city mall'
    })
    @IsNotEmpty({ message: 'location cannot be empty' })
    location: string;

    @ApiProperty({
        description: 'type of event',
        example: 'entertainment'
    })
    @IsNotEmpty({ message: 'type cannot be empty' })
    type: string;

    @ApiProperty({
        description: 'name of the event',
        example: 'Fij hangout'
    })
    @IsNotEmpty({ message: 'title cannot be empty' })
    title: string;

    @ApiProperty({
        description: 'when the event will take place',
        example: '2nd of may'
    })
    @IsNotEmpty()
    date: string;

    
    @ApiProperty({
        description: 'time',
        example: '4pm'
    })
    @IsNotEmpty()
    time: string
}

export class RegisterEventDto {
    
    @ApiProperty({
        description: 'name of the event',
        example: 'teachers retreat'
    })
    @IsNotEmpty({ message: 'name cannot be empty'})
    name: string

    
    @ApiProperty({
        description: 'user email',
        example: 'mark@gmail.com'
    })
    @IsEmail({}, {message: 'invalid email'})
    @IsNotEmpty({ message: 'name cannot be empty'})
    email: string
    
}