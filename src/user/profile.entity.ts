import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Profile {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    gender: number;

    @Column()
    photo: string;

    @Column()
    address: string;

    // 与 User 表建立一对一关系
    @OneToOne(() => User) // 指定关联的实体
    @JoinColumn() // 在具体表格创建关联的字段（外键）
    user: User;
}
