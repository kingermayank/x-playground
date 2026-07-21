import {
  experiments,
  formatDisplayDate,
  searchExperiments,
  filterExperiments,
  getAllTags,
} from './experiments.js?v=20260721-2';

const state = {
  query: '',
  tag: 'all',
};

const accessionBySlug = new Map(
  experiments.map((item, index) => [
    item.slug,
    String(experiments.length - index).padStart(3, '0'),
  ]),
);

const searchInput = document.querySelector('#experimentSearch');
const gallery = document.querySelector('#gallery');
const tagRail = document.querySelector('#tagRail');

function createTagButton(tag) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'tag-chip';
  button.dataset.tag = tag;
  button.textContent = tag === 'all' ? 'All' : tag;
  button.setAttribute('aria-pressed', String(tag === state.tag));

  button.addEventListener('click', () => {
    state.tag = tag;
    renderTagRail();
    renderGallery();
  });

  return button;
}

function renderTagRail() {
  const tags = ['all', ...getAllTags(experiments)];
  tagRail.replaceChildren(...tags.map(createTagButton));
}

function createCard(experiment) {
  const card = document.createElement('a');
  card.className = 'folio';
  card.href = experiment.href;
  card.style.setProperty('--accent', experiment.accent);
  card.dataset.preview = experiment.preview;
  card.setAttribute('aria-label', `Open dossier: ${experiment.title}`);

  const frame = document.createElement('div');
  frame.className = 'folio-frame';

  const number = document.createElement('span');
  number.className = 'folio-number';
  number.textContent = `No. ${accessionBySlug.get(experiment.slug)}`;

  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.setAttribute('aria-hidden', 'true');

  const stamp = document.createElement('span');
  stamp.className = 'folio-stamp';
  stamp.setAttribute('aria-hidden', 'true');
  stamp.textContent = 'Filed';

  frame.replaceChildren(number, preview, stamp);

  const body = document.createElement('div');
  body.className = 'folio-body';

  const titleRow = document.createElement('div');
  titleRow.className = 'folio-title-row';

  const title = document.createElement('h2');
  title.textContent = experiment.title;

  const date = document.createElement('time');
  date.className = 'date';
  date.dateTime = experiment.date;
  date.textContent = formatDisplayDate(experiment.date);

  titleRow.replaceChildren(title, date);

  const tags = document.createElement('ul');
  tags.className = 'folio-tags';
  tags.replaceChildren(
    ...experiment.tags.map((tag) => {
      const item = document.createElement('li');
      item.textContent = tag;
      return item;
    }),
  );

  const summary = document.createElement('p');
  summary.className = 'summary';
  summary.textContent = experiment.summary;

  body.replaceChildren(titleRow, tags, summary);
  card.replaceChildren(frame, body);

  return card;
}

function renderGallery() {
  const byTag = filterExperiments(experiments, state.tag);
  const visibleExperiments = searchExperiments(byTag, state.query);
  gallery.replaceChildren(...visibleExperiments.map(createCard));
}

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  renderGallery();
});

renderTagRail();
renderGallery();
