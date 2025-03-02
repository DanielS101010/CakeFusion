import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as os from 'os';
import { ValidationPipe } from '@nestjs/common/pipes/validation.pipe';

function getLocalIp(): string {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    for (const net of interfaces[interfaceName] ?? []) {
      // Only return a non-internal IPv4 address
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'localhost'; // fallback
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const localIp = getLocalIp();
  const localFrontendUrl = `http://${localIp}:4200`;
  const localhostUrl = 'http://localhost:4200';

  app.enableCors({
    origin: [localFrontendUrl, localhostUrl],
        methods: 'GET, POST, DELETE, PATCH',
        allowedHeaders: 'Content-Type, Accept, Authorization, X-Requested-With',
          credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  
  app.setGlobalPrefix('api');

  await app.listen(3000);
}
bootstrap();
