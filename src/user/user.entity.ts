import {
    Column,
    Entity,
    ManyToMany,
    OneToMany,
    PrimaryGeneratedColumn,
    JoinTable,
} from 'typeorm';
import { Logs } from '../logs/logs.entity';
import { Roles } from '../roles/roles.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    username: string;

    @Column()
    password: string;

    @OneToMany(() => Logs, (logs) => logs.user)
    logs: Logs[];

    @ManyToMany(() => Roles, (roles) => roles.users)
    @JoinTable({ name: 'user_roles' }) // 中间表
    roles: Roles[];
}
