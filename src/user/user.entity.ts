import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    JoinTable,
    OneToOne,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';
import { Profile } from './profile.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Logs, (logs) => logs.user) // 指向 logs 绑定的外键
    logs: Logs[];

    @ManyToMany(() => Roles, (roles) => roles.users)
    @JoinTable({ name: 'user_roles' }) // 中间表
    roles: Roles[];

    // 与 profile 表建立一对一关系
    @OneToOne(() => Profile, (profile) => profile.user) // 指向 profile 绑定的外键
    profile: Profile;
}
