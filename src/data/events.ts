export interface EventLocation {
  lat: number
  lng: number
}

export interface UruguayEvent {
  id: string
  name: string
  seasonLabel: string
  category: string
  shortDescription: string
  longDescription: string
  venueName: string
  address: string
  neighborhood: string
  coordinates: EventLocation
  imageUrl: string
  imageAlt: string
  tags: string[]
}

export const events: UruguayEvent[] = [
  {
    id: 'carnaval-de-montevideo',
    name: 'Carnaval de Montevideo',
    seasonLabel: 'Enero a marzo',
    category: 'Cultura',
    shortDescription: 'El carnaval mas largo del mundo enciende Montevideo con murga, humor, tablados barriales y una energia de verano constante.',
    longDescription:
      'El Carnaval de Montevideo se despliega entre tablados al aire libre y escenarios emblematicos, mezclando murga, parodistas, lubolos y un humor profundamente ligado a la vida uruguaya. Es el momento del ano en que la ciudad se siente mas colectiva, musical y teatral.',
    venueName: 'Teatro de Verano Ramon Collazo',
    address: 'Rambla Wilson 1000',
    neighborhood: 'Parque Rodo',
    coordinates: {
      lat: -34.9177,
      lng: -56.1647,
    },
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Publico disfrutando de un espectaculo de carnaval nocturno al aire libre',
    tags: ['Murga', 'Tablados', 'Noches de verano'],
  },
  {
    id: 'desfile-de-llamadas',
    name: 'Desfile de Llamadas',
    seasonLabel: 'Febrero',
    category: 'Patrimonio',
    shortDescription: 'Comparsas y tambores de candombe toman Barrio Sur y Palermo en una de las celebraciones culturales mas intensas del pais.',
    longDescription:
      'El Desfile de Llamadas honra la cultura afrouruguaya a traves del candombe, la danza y la memoria colectiva. El recorrido por Isla de Flores se transforma en un corredor de percusion, vestuario e identidad compartida que convoca tanto a montevideanos como a visitantes.',
    venueName: 'Isla de Flores parade circuit',
    address: 'Isla de Flores and Minas',
    neighborhood: 'Barrio Sur',
    coordinates: {
      lat: -34.9095,
      lng: -56.1928,
    },
    imageUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Comparsa avanzando por una calle festiva con bailarines y tambores',
    tags: ['Candombe', 'Desfile callejero', 'Cultura afrouruguaya'],
  },
  {
    id: 'semana-criolla-del-prado',
    name: 'Semana Criolla del Prado',
    seasonLabel: 'Semana de Turismo',
    category: 'Tradicion',
    shortDescription: 'El predio del Prado recibe jineteadas, musica popular, artesanias y tradiciones gauchas en uno de los encuentros mas grandes de Montevideo.',
    longDescription:
      'La Semana Criolla del Prado acerca las tradiciones rurales a la capital con jineteadas, ferias artesanales, gastronomia regional y propuestas familiares. Es un gran punto de encuentro entre la identidad de campo del Uruguay y el publico urbano.',
    venueName: 'Rural del Prado',
    address: 'Lucas Obes 1011',
    neighborhood: 'Prado',
    coordinates: { // -34.858405, -56.217565 | -34.8576, -56.2038
      lat: -34.858405,
      lng: -56.217565,
    },
    imageUrl: 'https://images.unsplash.com/photo-1517846693594-1567da72af75?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Jinete a caballo en un entorno de fiesta tradicional campera',
    tags: ['Cultura gaucha', 'Jineteadas', 'Feria gastronomica'],
  },
  {
    id: 'feria-internacional-del-libro',
    name: 'Feria Internacional del Libro de Montevideo',
    seasonLabel: 'Septiembre a octubre',
    category: 'Literatura',
    shortDescription: 'Lectores, editoriales y autores se encuentran en el centro de Montevideo para charlas, lanzamientos y una de las ferias culturales mas queridas de la ciudad.',
    longDescription:
      'La Feria Internacional del Libro de Montevideo convierte el atrio municipal en una gran sala publica de lectura, con novedades editoriales, debates, talleres y visitas escolares. Es una puerta de entrada cercana a la produccion literaria uruguaya y regional.',
    venueName: 'Atrio de la Intendencia de Montevideo',
    address: 'Av. 18 de Julio 1360',
    neighborhood: 'Centro',
    coordinates: {
      lat: -34.9054,
      lng: -56.1891,
    },
    imageUrl: 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Libros abiertos y personas recorriendo una feria literaria',
    tags: ['Libros', 'Charlas con autores', 'Editoriales'],
  },
  {
    id: 'montevideo-comics',
    name: 'Montevideo Comics',
    seasonLabel: 'Mayo a junio',
    category: 'Cultura pop',
    shortDescription: 'Cosplay, ilustracion, gaming y fandom se cruzan en una convencion masiva con una escena creativa muy local.',
    longDescription:
      'Montevideo Comics combina fandom global con creadores uruguayos, historieta independiente, talleres y competencias escenicas. Es uno de los eventos juveniles mas energeticos de la ciudad y una referencia anual para las comunidades de cultura pop.',
    venueName: 'Antel Arena',
    address: 'Av. Jose Pedro Varela 5000',
    neighborhood: 'Villa Espanola',
    coordinates: {
      lat: -34.8792,
      lng: -56.1399,
    },
    imageUrl: 'https://images.unsplash.com/photo-1501286353178-1ec881214838?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Convencion concurrida con luces de colores y personas disfrazadas',
    tags: ['Cosplay', 'Ilustracion', 'Gaming'],
  },
  {
    id: 'festival-cinematografico-internacional',
    name: 'Festival Cinematografico Internacional del Uruguay',
    seasonLabel: 'Abril',
    category: 'Cine',
    shortDescription: 'Una celebracion cinematografica centrada en funciones de autor, estrenos y conversaciones sobre el cine contemporaneo.',
    longDescription:
      'Con un fuerte espiritu cinefilo, el Festival Cinematografico Internacional del Uruguay conecta al publico local con una programacion internacional exigente. Funciones, paneles y retrospectivas crean una atmosfera intensa y reflexiva para amantes del cine.',
    venueName: 'Cinemateca Uruguaya',
    address: 'Bartolome Mitre 1236',
    neighborhood: 'Ciudad Vieja',
    coordinates: {
      lat: -34.9071,
      lng: -56.2025,
    },
    imageUrl: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Publico mirando una pelicula dentro de una sala de cine',
    tags: ['Funciones', 'Estrenos', 'Paneles'],
  },
  {
    id: 'festival-internacional-viva-el-tango',
    name: 'Festival Internacional Viva el Tango',
    seasonLabel: 'Octubre',
    category: 'Musica',
    shortDescription: 'Conciertos, milongas y clases magistrales celebran el tango rioplatense en salas del centro montevideano.',
    longDescription:
      'Viva el Tango reconecta a la ciudad con uno de sus lenguajes musicales fundamentales a traves de espectaculos, baile y talleres. Su programacion suele mezclar repertorio historico con interpretaciones contemporaneas en un marco urbano elegante.',
    venueName: 'Sala Zitarrosa',
    address: 'Av. 18 de Julio 1012',
    neighborhood: 'Centro',
    coordinates: {
      lat: -34.9065,
      lng: -56.1974,
    },
    imageUrl: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Pareja bailando tango bajo una iluminacion calida de escenario',
    tags: ['Tango', 'Milonga', 'Musica en vivo'],
  },
  {
    id: 'fidae',
    name: 'FIDAE',
    seasonLabel: 'Agosto',
    category: 'Artes escenicas',
    shortDescription: 'El Festival Internacional de Artes Escenicas llena los teatros montevideanos con danza, teatro y experimentacion contemporanea.',
    longDescription:
      'FIDAE es una de las principales vitrinas uruguayas para las artes escenicas, con companias regionales e internacionales en un formato ambicioso. Su programa en Montevideo suele apoyarse en salas patrimoniales mientras abre espacio para nuevos lenguajes escenicos.',
    venueName: 'Teatro Solis',
    address: 'Buenos Aires s/n',
    neighborhood: 'Ciudad Vieja',
    coordinates: {
      lat: -34.9072,
      lng: -56.2012,
    },
    imageUrl: 'https://images.unsplash.com/photo-1503095396549-807759245b35?auto=format&fit=crop&w=1200&q=80',
    imageAlt: 'Interior de teatro historico con escenario iluminado y butacas rojas',
    tags: ['Teatro', 'Danza', 'Companias internacionales'],
  },
]

export const defaultEventId = events[0]?.id ?? ''
