export interface AppConfig {
  appName: string;
  version: string;
  defaultLocale: string;
  defaultCurrency: string;
  apiUrl: string;
  supportEmail: string;
}

export const APP_CONFIG: AppConfig = {
  appName: 'DeliveryControl & Banking',
  version: '2.5.0',
  defaultLocale: 'es-ES',
  defaultCurrency: 'BRL',
  apiUrl: '/api',
  supportEmail: 'soporte@deliverycontrol.com',
};

export default APP_CONFIG;
