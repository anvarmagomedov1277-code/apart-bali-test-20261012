import { siteConfig } from './site-config.js';

export function whatsappMessage(context, apartment = siteConfig.apartments[0]) {
  switch (context) {
    case 'installments': return 'Здравствуйте! Интересует апарт-комплекс БАЛИ. Хочу получить полную информацию по дубайской рассрочке и подробные условия покупки.';
    case 'project': return 'Здравствуйте! Хочу узнать подробнее об апарт-комплексе БАЛИ: корпусах, инфраструктуре, сроках и доступных апартаментах. Пришлите, пожалуйста, презентацию проекта.';
    case 'investment': return 'Здравствуйте! Интересуют инвестиции в апартаменты БАЛИ. Хочу получить расчёт дохода от аренды, расходов на управление и потенциала роста стоимости.';
    case 'apartment': return 'Здравствуйте! Хочу получить расчёт по планировке ' + apartment.area + ' м² в апарт-комплексе БАЛИ: стоимость, наличие и условия дубайской рассрочки.';
    default: return 'Здравствуйте! Интересует апарт-комплекс БАЛИ. Пришлите, пожалуйста, подробное предложение: варианты апартаментов, стоимость и условия покупки.';
  }
}

export function whatsappUrl(context, apartment) {
  const number = siteConfig.contact.whatsapp;
  if (!/^\d{10,15}$/.test(number)) throw new Error('Invalid public WhatsApp number');
  return 'https://wa.me/' + number + '?text=' + encodeURIComponent(whatsappMessage(context, apartment));
}
