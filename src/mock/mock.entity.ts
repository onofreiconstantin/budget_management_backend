import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mock: string;

  @Column()
  test: string;
}
