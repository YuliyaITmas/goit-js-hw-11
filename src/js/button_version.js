import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import { PixabayAPI } from './fetchPhoto';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

import markup from '../templates/markup.hbs';

const formEl = document.querySelector('#search-form');
const inputEl = document.querySelector('input[name="searchQuery"]');
const galleryEl = document.querySelector('.gallery');
const loadMoreEl = document.querySelector('.load-more');

const pixabayAPI = new PixabayAPI();

let gallery = new SimpleLightbox('.gallery a', { captionDelay: 250 });

loadMoreEl.classList.add('is-hidden');

formEl.addEventListener('submit', handleFormSubmit);
loadMoreEl.addEventListener('click', handleLoadMoreBtnClick);

async function handleFormSubmit(event) {
  pixabayAPI.page = 1;
  event.preventDefault();

  loadMoreEl.classList.add('is-hidden');
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
      const pageTotal = data.totalHits / pixabayAPI.count;

      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      galleryEl.innerHTML = markup(data.hits);

      if (pageTotal <= pixabayAPI.page || data.totalHits === 0) {
        loadMoreEl.classList.add('is-hidden');
        return;
      }
      loadMoreEl.classList.remove('is-hidden');

      gallery.refresh();
    }
  } catch (error) {
    console.log(error);
  }
}

async function handleLoadMoreBtnClick() {
  pixabayAPI.page += 1;

  try {
    const { data } = await pixabayAPI.fetchPhoto();
    const pageTotal = data.totalHits / pixabayAPI.count;
console.log(data.totalHits)
    if (pageTotal <= pixabayAPI.page || data.totalHits === 0) {
      Notify.info("We're sorry, but you've reached the end of search results.");
      loadMoreEl.classList.add('is-hidden');
    }

    galleryEl.insertAdjacentHTML('beforeend', markup(data.hits));
    gallery.refresh();
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
window.addEventListener('scroll', handleHeader);


function smoothScroll(event) {
  event.preventDefault();
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();
  const cardMargin = 12;
  const cardsToScroll = 2; 
  console.log(cardHeight);
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

galleryEl.addEventListener('wheel', smoothScroll);





// const header = document.querySelector('.header');
// let headerHeight = header.offsetHeight;
// let isHeaderFixed = false;

// function handleHeader() {
//   headerHeight = header.offsetHeight;
//   if (window.scrollY >= headerHeight) {
//     if (!isHeaderFixed) {
//       isHeaderFixed = true;
//       header.classList.add('fixed');
//     }
//   } else {
//     if (isHeaderFixed) {
//       isHeaderFixed = false;
//       header.classList.remove('fixed');
//     }
//   }
// }

// async function loadMoreCards() {
//   const galleryEl = document.querySelector('.gallery');
//   const { height: cardHeight } = galleryEl.firstElementChild.getBoundingClientRect();
//   const cardMargin = 12;
//   const cardsToLoad = 4; // количество карточек, которые нужно загрузить при достижении конца списка
//   const headerOffset = isHeaderFixed ? headerHeight : 0;
//   const scrollTop = window.scrollY - headerOffset;
//   const galleryHeight = galleryEl.scrollHeight;

//   if (scrollTop + window.innerHeight >= galleryHeight) {
//     // мы достигли конца списка, загружаем новые карточки
//     for (let i = 0; i < cardsToLoad; i++) {
//       // здесь вы можете загружать карточки из вашего источника данных или создавать их динамически
//       const newCardEl = document.createElement('div');
//       newCardEl.classList.add('card');
//       galleryEl.appendChild(newCardEl);
//     }
//     // после загрузки новых карточек пересчитываем высоту списка
//     const newGalleryHeight = galleryEl.scrollHeight;
//     // прокручиваем до начала новых карточек
//     window.scroll({
//       top: newGalleryHeight - galleryHeight + scrollTop,
//       left: 0,
//       behavior: 'smooth',
//     });
//   }
// }

// window.addEventListener('scroll', handleHeader);
// window.addEventListener('scroll', loadMoreCards);



// const galleryEl = document.querySelector('.gallery');
// let page = 1;
// let isLoading = false;

// async function loadMoreData() {
//   if (isLoading) return;

//   isLoading = true;
//   const  { data }  = await pixabayAPI.fetchPhoto();
 

//   if (data.hits.length > 0) {
//     galleryEl.innerHTML += markup(data.hits);
//     page++;
//   } else {
//     window.removeEventListener('scroll', handleScroll);
//   }

//   isLoading = false;
// }

// function handleScroll() {
//   const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
//   if (scrollTop + clientHeight >= scrollHeight - 5 && !isLoading) {
//     loadMoreData();
//   }
// }

// loadMoreData();
// window.addEventListener('scroll', handleScroll);
