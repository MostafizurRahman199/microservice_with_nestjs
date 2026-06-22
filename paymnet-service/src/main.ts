import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app/app.module";
import Consul from "consul";

async function bootstrap() {

  const app = await NestFactory.create(AppModule);

  const port = 3005;
  const consul = new Consul({host:'localhost', port:8500});
  const serviceId = 'payment-unique-id-1';
  
  // Use the Docker host IP (172.17.0.1) instead of localhost.
  // Since Consul runs in Docker (Node ad6754427014), 'localhost' refers to the container itself.
  const hostIp = '172.17.0.1'; 
  
  const registrationDetails = {
    id: serviceId,
    name: 'payment-service',
    address: hostIp,
    port: port,
    check: {
      name: 'payment-service-health',
      http: `http://${hostIp}:${port}/api/health`,
      interval: '10s',
      timeout: '5s',
    }
  };

  try {
    await consul.agent.service.register(registrationDetails);
    console.log('Payment service registered with Consul successfully');
  } catch (error) {
    console.error('Failed to register Payment service with Consul:', error);
  }

  const teardown = async () => {
    try {
      await consul.agent.service.deregister(serviceId);
      console.log('Payment service deregistered from Consul successfully');
    } catch (error) {
      console.error('Failed to deregister Payment service from Consul:', error);
    }
    await app.close();
    process.exit(0);
  };

  process.on('SIGINT', teardown);
  process.on('SIGTERM', teardown);

  // Listen on '0.0.0.0' to ensure the app is accessible via the Docker host IP (172.17.0.1)
  await app.listen(port, '0.0.0.0');
  console.log(`Payment service is running on http://localhost:${port}`);
}

bootstrap();