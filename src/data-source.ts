import { loadEnvFile } from 'process';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { getTypeOrmConfig } from './database/typeorm.config';

loadEnvFile('.env');

const configService = new ConfigService();

export default new DataSource(getTypeOrmConfig(configService));
