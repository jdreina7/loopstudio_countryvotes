export const translations = {
  en: {
    header: {
      appLogoTitle: 'loopstudio',
      title: 'Fullstack Developer Challenge',
    },
    voteForm: {
      title: 'Vote your Favourite Country',
      namePlaceholder: 'Name',
      emailPlaceholder: 'Email',
      countryPlaceholder: 'Country',
      submitButton: 'Submit Vote',
      submitting: 'Submitting...',
      validation: {
        nameMin: 'Name must be at least 2 characters',
        emailInvalid: 'Invalid email',
        countryRequired: 'Please select a country',
        countryCodeInvalid: 'Please select a valid country',
        flagInvalid: 'Invalid flag URL',
      },
    },
    success: {
      title: 'Thank you for voting!',
      message: 'Your vote was successfully submitted.',
    },
    error: {
      title: 'This email has already voted!',
      message: 'Only one vote per email is allowed.',
    },
    countriesTable: {
      title: 'Top 10 Most Voted Countries',
      searchPlaceholder: 'Search Country, Capital City, Region or Subregion...',
      position: 'Position',
      country: 'Country',
      flag: 'Flag',
      capital: 'Capital City',
      region: 'Region',
      subregion: 'Sub Region',
      votes: 'Votes',
      loading: 'Loading countries...',
      noResults: 'No countries found',
      noVotes: 'No votes yet',
    },
    autocomplete: {
      noResults: 'No countries found',
    },
    footer: {
      author: 'Author:',
    },
    health: {
      systemStatus: 'System Status',
      checking: 'Checking...',
      error: 'Service Error',
      cannotConnect: 'Cannot connect to backend',
      database: 'Database',
      externalApi: 'Countries API',
      online: 'Online',
      offline: 'Offline',
    },
    charts: {
      sectionTitle: 'Statistics & Analytics',
      topCountriesTitle: 'Top 10 Countries by Votes',
      regionDistribution: 'Votes by Sub-Region',
      totalVotes: 'Total Votes',
      uniqueCountries: 'Countries with Votes',
    },
  },
  es: {
    header: {
      appLogoTitle: 'loopstudio',
      title: 'Desafío de Desarrollador Fullstack',
    },
    voteForm: {
      title: 'Vota por tu País Favorito',
      namePlaceholder: 'Nombre',
      emailPlaceholder: 'Correo electrónico',
      countryPlaceholder: 'País',
      submitButton: 'Enviar Voto',
      submitting: 'Enviando...',
      validation: {
        nameMin: 'El nombre debe tener al menos 2 caracteres',
        emailInvalid: 'Correo electrónico inválido',
        countryRequired: 'Por favor selecciona un país',
        countryCodeInvalid: 'Por favor selecciona un país válido',
        flagInvalid: 'URL de bandera inválida',
      },
    },
    success: {
      title: '¡Gracias por votar!',
      message: 'Tu voto ha sido registrado exitosamente.',
    },
    error: {
      title: '¡Este correo ya votó!',
      message: 'Solo se permite un voto por correo electrónico.',
    },
    countriesTable: {
      title: 'Top 10 Países Más Votados',
      searchPlaceholder: 'Buscar País, Ciudad Capital, Región o Sub Región...',
      position: 'Posición',
      country: 'País',
      flag: 'Bandera',
      capital: 'Ciudad Capital',
      region: 'Región',
      subregion: 'Sub Región',
      votes: 'Votos',
      loading: 'Cargando países...',
      noResults: 'No se encontraron países',
      noVotes: 'No hay votos aún',
    },
    autocomplete: {
      noResults: 'No se encontraron países',
    },
    footer: {
      author: 'Autor:',
    },
    health: {
      systemStatus: 'Estado del Sistema',
      checking: 'Verificando...',
      error: 'Error del Servicio',
      cannotConnect: 'No se puede conectar al backend',
      database: 'Base de Datos',
      externalApi: 'API de Países',
      online: 'En línea',
      offline: 'Fuera de línea',
    },
    charts: {
      sectionTitle: 'Estadísticas y Análisis',
      topCountriesTitle: 'Top 10 Países por Votos',
      regionDistribution: 'Votos por Sub-Región',
      totalVotes: 'Total de Votos',
      uniqueCountries: 'Países con Votos',
    },
  },
};

export type Translations = typeof translations.en;
export type Language = 'en' | 'es';
