/* Edit this object to replace the prototype content. Use real URLs only. */
const profile = {
  // Edit homepage section headings and paragraphs here. Labels are optional.
  greeting: "Hi, I'm Shuyuan!",
  biography: [
    {
      "heading": "Research:",
      "paragraphs": [
        "I'm an undergraduate student in Computer Science at Shanghai University of Finance and Economics (SUFE). I'm currently working on topics in theoretical computer science, particularly information design and Bayesian persuasion.",
        "I'm also exploring economics and other areas of computer science, guided by curiosity.",
        {
          "parts": [
            "I'm fortunate to work with ",
            {
              "link": {
                "text": "Renzhe Xu",
                "url": "https://windxrz.github.io/"
              }
            },
            " at SUFE (since Fall 2025) and ",
            {
              "link": {
                "text": "Kangning Wang",
                "url": "https://people.cs.rutgers.edu/~kn.w/"
              }
            },
            " at Rutgers University (since Summer 2026)."
          ]
        }
      ]
    },
    {
      "heading": "In life:",
      "paragraphs": [
        "I enjoy musicals, opera and archery.",
        {
          "label": "Musicals, Opera & Concerts:",
          "text": "I'm the founder of the SUFE Musical Theatre Club. We are always open to opportunities to collaborate on events and performances, and we're also seeking vocal coaches. Please contact me if you are interested!"
        },
        "I'll occasionally update my blog with posts about musicals/opera/concerts, or other things.",
        {
          "label": "Archery:",
          "text": "Still progressing!"
        },
        {
          "label": "Others:",
          "parts": [
            "I'm deeply inspired by Victor Hugo, especially his novels ",
            {
              "em": "Ninety-Three"
            },
            " and ",
            {
              "em": "Les Misérables"
            },
            ". I'm also particularly fond of the musical ",
            {
              "em": "Hamilton"
            },
            ". My favorite figure of the French Revolution is the Marquis de Lafayette, for his passion and tragic naivety."
          ]
        }
      ]
    }
  ],
  beyond: 'Outside research, I enjoy musical theatre, opera, and the performing arts.',
  portrait: 'assets/portrait.jpg',
  portraitAlt: 'Shuyuan Jia',
  email: 'shuyuan.j@outlook.com',
  cv: null, // e.g. 'assets/shuyuan-jia-cv.pdf'
  // Research works, in display order.
  works: [
    {
      "title": "Persuasion by Parts",
      "url": "https://arxiv.org/abs/2611.02845",
      "authorSuffix": "(alphabetical order)",
      "authors": [
        {
          "name": "Shuyuan Jia"
        },
        {
          "name": "Kangning Wang",
          "url": "https://people.cs.rutgers.edu/~kn.w/"
        },
        {
          "name": "Renzhe Xu",
          "url": "https://windxrz.github.io/"
        }
      ],
      "venue": "arXiv preprint",
      "arxiv": "2611.02845",
      "presentationVideo": "https://drive.google.com/file/d/1ywK8K8lA4Fmbjc2Sxj7SbMHyEewHaCLY/view?usp=drive_link"
    }
  ]
};
for (const key of ['beyond']) {
  const field = document.querySelector(`[data-field="${key}"]`);
  if (field) field.textContent = profile[key];
}
const greeting = document.querySelector('[data-field="greeting"]');
if (greeting) greeting.textContent = profile.greeting;
const biography = document.querySelector('[data-field="biography"]');
if (biography && Array.isArray(profile.biography)) {
  const sections = profile.biography.map((entry) => {
    const section = document.createElement('section');
    const heading = document.createElement('h2');
    heading.textContent = entry.heading;
    section.append(heading);
    for (const paragraph of entry.paragraphs) {
      const p = document.createElement('p');
      if (typeof paragraph === 'string') p.textContent = paragraph;
      else {
        if (paragraph.label) {
          const label = document.createElement('strong');
          label.textContent = paragraph.label + ' ';
          p.append(label);
        }
        for (const part of paragraph.parts || [paragraph.text]) {
          if (typeof part === 'string') p.append(document.createTextNode(part));
          else if (part.link && safeUrl(part.link.url)) {
            const a = document.createElement('a');
            a.href = safeUrl(part.link.url);
            a.textContent = part.link.text;
            p.append(a);
          }
          else if (part.em) {
            const em = document.createElement('em');
            em.textContent = part.em;
            p.append(em);
          }
        }
      }
      section.append(p);
    }
    return section;
  });
  biography.replaceChildren(...sections);
}
function safeUrl(value) {
  const url = new URL(value, window.location.href);
  return ['https:', 'http:'].includes(url.protocol) ? url.href : null;
}
if (profile.portrait && safeUrl(profile.portrait) && document.getElementById('portrait-container')) {
  const container = document.getElementById('portrait-container');
  const existing = container.querySelector('img');
  if (existing && existing.src === safeUrl(profile.portrait)) {
    existing.alt = profile.portraitAlt;
  } else {
    const image = new Image(); image.src = safeUrl(profile.portrait); image.alt = profile.portraitAlt;
    image.decoding = 'async';
    container.replaceChildren(image);
  }
}
function setLink(id, text, url) {
  const target = document.getElementById(id); if (!target) return; const a = document.createElement('a');
  a.textContent = text; a.href = url; target.replaceChildren(a); target.classList.remove('pending');
}
if (profile.email) {
  for (const id of ['email-link', 'home-email']) setLink(id, profile.email, `mailto:${profile.email}`);
}
if (profile.cv && safeUrl(profile.cv)) {
  for (const slot of document.querySelectorAll('[data-cv-link]')) {
    const link = document.createElement('a');
    link.href = safeUrl(profile.cv);
    link.textContent = 'CV ↗';
    slot.replaceWith(link);
  }
}
// Use the Drive viewer rather than an export/download endpoint.
function driveVideoPreviewUrl(value) {
  try {
    const url = new URL(value);
    if (url.protocol !== 'https:' || url.hostname !== 'drive.google.com') return null;
    const match = url.pathname.match(/^\/file\/d\/([^/]+)/);
    const id = match ? match[1] : url.searchParams.get('id');
    return id ? 'https://drive.google.com/file/d/' + encodeURIComponent(id) + '/view' : null;
  } catch { return null; }
}
const works = document.getElementById('works');
if (works && profile.works.length) {
  const articles = profile.works.map(work => {
    const article = document.createElement('article');
    article.className = 'research-work';
    const heading = document.createElement('h2');
    if (work.url && safeUrl(work.url)) {
      const link = document.createElement('a');
      link.href = safeUrl(work.url); link.textContent = work.title;
      heading.append(link);
    } else heading.textContent = work.title;
    const authors = document.createElement('p'); authors.className = 'research-authors';
    if (work.authorPrefix) authors.append(document.createTextNode(work.authorPrefix + ' '));
    work.authors.forEach((author, index) => {
      if (index) authors.append(document.createTextNode(', '));
      if (author.url && safeUrl(author.url)) {
        const link = document.createElement('a'); link.href = safeUrl(author.url);
        link.textContent = author.name; authors.append(link);
      } else authors.append(document.createTextNode(author.name));
    });
    if (work.authorSuffix) {
      const note = document.createElement('span'); note.className = 'author-order-note';
      note.textContent = work.authorSuffix;
      authors.append(document.createTextNode('\u00a0'), note);
    }
    const venue = document.createElement('p'); venue.className = 'research-venue';
    venue.append(document.createTextNode(work.venue));
    if (work.arxiv && work.url && safeUrl(work.url)) {
      const link = document.createElement('a'); link.href = safeUrl(work.url);
      link.textContent = 'arXiv:' + work.arxiv;
      venue.append(document.createTextNode(' · '), link);
    }
    article.append(heading, authors, venue);
    if (work.presentationVideo) {
      const line = document.createElement('p'); line.className = 'research-video';
      const link = document.createElement('a'); link.className = 'presentation-link';
      link.target = '_blank'; link.rel = 'noopener noreferrer';
      const url = driveVideoPreviewUrl(work.presentationVideo);
      if (url) link.href = url;
      else { link.setAttribute('role', 'link'); link.setAttribute('aria-disabled', 'true'); }
      const icon = document.createElement('span'); icon.className = 'video-play';
      icon.setAttribute('aria-hidden', 'true'); icon.textContent = '▶';
      const label = document.createElement('span'); label.className = 'video-label';
      label.textContent = 'Presentation Video';
      link.append(icon, label);
      line.append(link); article.append(line);
    }
    return article;
  });
  works.replaceChildren(...articles);
}
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
