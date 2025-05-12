// src/components/Carousel.jsx
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Keyboard, Lazy } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/lazy';

export default function Carousel({ items }) {
  return (
    <Swiper
      modules={[Navigation, Pagination, Keyboard, Lazy]}
      spaceBetween={16}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      keyboard={{ enabled: true }}
      lazy={{ loadPrevNext: true }}
      breakpoints={{
        640: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
    >
      {items.map((item, i) => (
        <SwiperSlide key={i}>
          <div className="p-4 bg-white rounded-lg shadow hover:shadow-lg transition">
            <img
              data-src={item.img}
              className="swiper-lazy w-full h-48 object-cover rounded-md mb-4"
              alt={item.alt}
            />
            <div className="swiper-lazy-preloader"></div>
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            {item.excerpt && <p className="text-sm text-gray-600">{item.excerpt}</p>}
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}