interface Season {
  name: string;
  icon: string;
  months: string;
  temperature: string;
  characteristics: string;
  activities: string;
}

export function getCurrentSeason() {
  const month = new Date().getMonth() + 1;

  if (month === 12 || month <= 2)
    return {
      name: 'Verano',
      months: 'Dic - Feb',
      image:
        'https://cdn1.infocasas.com.uy/web/659efb4923275_verano-portada.jpg#hasTH',
      emoji: '☀️',
    };
  if (month >= 3 && month <= 5)
    return {
      name: 'Otoño',
      months: 'Mar - May',
      image:
        'https://imgs.elpais.com.uy/dims4/default/581bc4c/2147483647/strip/true/crop/1600x1100+0+50/resize/1440x990!/format/webp/quality/90/?url=https%3A%2F%2Fel-pais-uruguay-production-web.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fe8%2F56%2F1bc33e28412eb20fc6aab2b7765f%2Fotono-1.jpg',
      emoji: '🍂',
    };
  if (month >= 6 && month <= 8)
    return {
      name: 'Invierno',
      months: 'Jun - Ago',
      image:
        'https://imgs.elpais.com.uy/dims4/default/c1c5c04/2147483647/strip/true/crop/4049x2784+63+0/resize/1440x990!/format/webp/quality/90/?url=https%3A%2F%2Fel-pais-uruguay-production-web.s3.us-east-1.amazonaws.com%2Fbrightspot%2Fbe%2F05%2F8fdb1d9744cb89537e8d7cb35502%2Frff-0041-helada-departamento-lavalleja.JPG',
      emoji: '❄️',
    };
  return {
    name: 'Primavera',
    months: 'Sep - Nov',
    image:
      'https://imgs.elpais.com.uy/dims4/default/73a96c8/2147483647/strip/true/crop/1862x1280+13+0/resize/1440x990!/format/webp/quality/90/?url=https%3A%2F%2Fel-pais-uruguay-production-web.s3.us-east-1.amazonaws.com%2Fbrightspot%2F31%2F9e%2F572c559842a282d19a65174e23b8%2Fsonia-cervantes-mquudjnxeh8-unsplash.jpg',
    emoji: '🌸',
  };
}

export function getSeasonsInfo() {
  return [
    {
      name: 'Verano',
      icon: '☀️',
      months: 'Diciembre - Febrero',
      temperature: '20-25°C (68-77°F)',
      characteristics:
        'Días calurosos y soleados con tormentas ocasionales. Temporada alta turística con actividades en la playa.',
      activities:
        'Playa, deportes acuáticos, gastronomía al aire libre, festivales',
    },
    {
      name: 'Otoño',
      icon: '🍂',
      months: 'Marzo - Mayo',
      temperature: '15-20°C (59-68°F)',
      characteristics:
        'Temperaturas suaves y mayor lluvia. Follaje colorido en algunas regiones.',
      activities: 'Enoturismo, eventos culturales, caminatas en la naturaleza',
    },
    {
      name: 'Invierno',
      icon: '❄️',
      months: 'Junio - Agosto',
      temperature: '8-12°C (46-54°F)',
      characteristics:
        'Días fríos y grises con lluvia frecuente. Raramente nieva o hiela.',
      activities: 'Termas, actividades culturales, gastronomía, enoturismo',
    },
    {
      name: 'Primavera',
      icon: '🌸',
      months: 'Septiembre - Noviembre',
      temperature: '12-18°C (54-64°F)',
      characteristics:
        'Temperaturas suaves y clima variable. La naturaleza florece.',
      activities:
        'Senderismo, avistamiento de aves, exploración al aire libre, jardinería',
    },
  ];
}
