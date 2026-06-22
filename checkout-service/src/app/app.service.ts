import { Injectable, InternalServerErrorException } from '@nestjs/common';
import Consul from 'consul';
import axios from 'axios';

@Injectable()
export class AppService {
  // Initialize the Consul client to connect to the local Consul agent.
  // The Consul agent typically runs locally (localhost) on the default port 8500.
  // This client allows our checkout-service to ask Consul about other registered services.
  private consul = new Consul({ host: 'localhost', port: 8500 });

  getData(): { message: string } {
    return { message: 'this is checkout service response' };
  }

  /**
   * Discovers the Payment Service via Consul and makes an HTTP request to it.
   * This demonstrates how microservices can find and talk to each other
   * dynamically without hardcoding exact IP addresses or ports.
   */
  async discoverAndCallPayment() {
    try {
      // Step 1: Query Consul for the 'payment-service'
      // We ask Consul to return all instances of 'payment-service' that are currently passing their health checks.
      // 'passing: true' ensures we only attempt to contact services that are fully running and healthy.
      const services: any = await this.consul.health.service({
        service: 'payment-service',
        passing: true,
      });

      // If Consul returns no services, it means the Payment Service is either down,
      // hasn't registered itself, or is currently failing its health checks.
      if (!services || services.length === 0) {
        throw new Error('Payment service is not available or has no healthy instances');
      }

      // Step 2: Find the specific service instance we want to talk to
      // In many applications, you might load balance by picking a random service from the list.
      // Here, we specifically look for the service instance that registered with the ID 'payment-unique-id-1'.
      const targetServiceId = 'payment-unique-id-1';
      const serviceNode = services.find((node: any) => node.Service.ID === targetServiceId);

      // If we found 'payment-service' instances but none of them have our target ID, we throw an error.
      if (!serviceNode) {
        throw new Error(`Payment service instance with ID '${targetServiceId}' not found or not healthy`);
      }

      // Step 3: Extract the connection details
      // Consul tells us exactly where this specific service instance is running on the network.
      const address = serviceNode.Service.Address;
      const port = serviceNode.Service.Port;

      // Step 4: Construct the URL and make the request
      // Now that we know the dynamic IP address and port of the payment service,
      // we can build the URL and use Axios to make a standard HTTP GET request to its /api endpoint.
      const url = `http://${address}:${port}/api`;
      const response = await axios.get(url);
      
      // Step 5: Return the combined result
      // We return our own success message along with the data we retrieved from the payment service.
      return {
        message: 'Successfully called payment-service via Consul discovery!',
        discoveredAt: `${address}:${port}`,
        // serviceData: serviceNode.Service,
        paymentServiceResponse: response.data,
      };
    } catch (error) {
      console.error('Error discovering/calling payment service:', error);
      // If anything fails (e.g., Consul is down, Payment Service is unreachable), 
      // we gracefully return a 500 Internal Server Error to whoever called the checkout-service.
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      throw new InternalServerErrorException(errorMessage);
    }
  }
}
