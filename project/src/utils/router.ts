export const getCodeFromURL = (): string | null => {
  const path = window.location.pathname;
  const code = path.replace(/^\//, '').trim();

  if (code && code !== '' && !code.includes('/')) {
    return code;
  }

  return null;
};

export const navigateToCode = (code: string) => {
  window.history.pushState({}, '', `/${code}`);
};

export const navigateToHome = () => {
  window.history.pushState({}, '', '/');
};

export const updatePageMetadata = (data: {
  title: string;
  description: string;
  studentName?: string;
  institutionName?: string;
}) => {
  document.title = data.title;

  let metaDescription = document.querySelector('meta[name="description"]');
  if (!metaDescription) {
    metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    document.head.appendChild(metaDescription);
  }
  metaDescription.setAttribute('content', data.description);

  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', data.title);

  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute('content', data.description);
};
