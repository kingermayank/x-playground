import {
  experiments,
  formatDisplayDate,
  searchExperiments,
} from './experiments.js';

const state = {
  query: '',
};

const searchInput = document.querySelector('#experimentSearch');
const gallery = document.querySelector('#gallery');
const galleryCount = document.querySelector('#galleryCount');

function createCard(experiment) {
  const card = document.createElement('a');
  card.className = 'card';
  card.href = experiment.href;
  card.style.setProperty('--accent', experiment.accent);
  card.dataset.preview = experiment.preview;
  card.setAttribute('aria-label', `Open ${experiment.title}`);

  const preview = document.createElement('div');
  preview.className = 'preview';
  preview.setAttribute('aria-hidden', 'true');

  const body = document.createElement('div');
  body.className = 'card-body';

  const titleRow = document.createElement('div');
  titleRow.className = 'card-title-row';

  const title = document.createElement('h2');
  title.textContent = experiment.title;

  const date = document.createElement('time');
  date.className = 'date';
  date.dateTime = experiment.date;
  date.textContent = formatDisplayDate(experiment.date);

  const summary = document.createElement('p');
  summary.className = 'summary';
  summary.textContent = experiment.summary;

  const cue = document.createElement('span');
  cue.className = 'open-cue';
  cue.textContent = 'Preview';

  titleRow.replaceChildren(title, date);
  body.replaceChildren(titleRow, summary, cue);
  card.replaceChildren(preview, body);

  return card;
}

function renderGallery() {
  const visibleExperiments = searchExperiments(experiments, state.query);
  gallery.replaceChildren(...visibleExperiments.map(createCard));

  const noun = visibleExperiments.length === 1 ? 'experiment' : 'experiments';
  const suffix = state.query ? ` for "${state.query}"` : '';
  galleryCount.textContent = `${visibleExperiments.length} ${noun}${suffix}`;
}

searchInput.addEventListener('input', () => {
  state.query = searchInput.value;
  renderGallery();
});

renderGallery();
