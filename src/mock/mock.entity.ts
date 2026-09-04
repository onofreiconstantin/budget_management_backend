import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Mock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  mock: string;

  @Column()
  test: string;

  @Column({ name: 'test_mod' })
  testMod: string;

  @Column({ name: 'test_mod2' })
  testMod2: string;
}
