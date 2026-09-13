export interface ConfiguracaoApp {
  nomeApp: string;
  versao: string;
  localPadrao: string;
  moedaPadrao: string;
  urlApi: string;
  emailSuporte: string;
}

export const CONFIGURACAO_APP: ConfiguracaoApp = {
  nomeApp: 'DeliveryControl & Sistema Bancário',
  versao: '2.5.0',
  localPadrao: 'pt-BR',
  moedaPadrao: 'BRL',
  urlApi: '/api',
  emailSuporte: 'suporte@deliverycontrol.com',
};

export const APP_CONFIG = CONFIGURACAO_APP;
export default CONFIGURACAO_APP;
