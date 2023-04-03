import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayAPI } from './fetchPhoto';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import markup from '../templates/markup.hbs';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('input[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
// const loadMoreEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();
let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });

pixabayAPI.page = 1;

let isLoading = false;
galleryEl.innerHTML = '';

formEl.addEventListener('submit', handleFormSubmit);
window.addEventListener('scroll', handleScroll);
galleryEl.addEventListener('wheel', smoothScroll);
window.addEventListener('scroll', handleHeader);

async function handleFormSubmit(event) {
  event.preventDefault();

  galleryEl.innerHTML = '';
  pixabayAPI.query = inputEl.value.trim();

  try {
    if (pixabayAPI.query) {
      const { data } = await pixabayAPI.fetchPhoto();

      if (data.hits.length === 0) {
        return Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
      console.log(data);

      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      galleryEl.innerHTML = markup(data.hits);

      gallery.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

async function loadMoreData() {
  if (isLoading) {
    return;
  }
  isLoading = true;

  try {
    pixabayAPI.page += 1;
    const { data } = await pixabayAPI.fetchPhoto();

    console.log(data.hits);
    if (data.hits.length > 0) {
      galleryEl.insertAdjacentHTML('beforeend', markup(data.hits));
     
    } else if (data.hits.length === 0) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      window.removeEventListener('scroll', handleScroll);
      return;
    }
    gallery.refresh();
    isLoading = false;
  } catch (error) {
    console.log(error);
  }
}

const header = document.querySelector('.header');
const headerHeight = header.offsetHeight;

function handleHeader() {
  if (window.scrollY >= headerHeight) {
    header.classList.add('fixed');
  } else {
    header.classList.remove('fixed');
  }
}

function smoothScroll(event) {
  event.preventDefault();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  const cardMargin = 12;
  const cardsToScroll = 2;

  if (event.deltaY < 0) {
    // scrolling up
    window.scrollBy({
      top: -(cardHeight + cardMargin) * cardsToScroll,
      behavior: 'smooth',
    });
  } else if (event.deltaY > 0) {
    // scrolling down
    window.scrollBy({
      top: (cardHeight + cardMargin) * cardsToScroll,
      behavior: 'smooth',
    });
  }
}

function handleScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
    loadMoreData();
  }
}
