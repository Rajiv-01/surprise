import React from "react";
import HTMLFlipBook from "react-pageflip";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Beginning from "../assets/images/Beginning.jpeg";
import FirstPicture from "../assets/images/FirstPicture.jpeg";
import FirstDate from "../assets/images/FirstDate.jpeg";
import FirstBoquet from "../assets/images/FirstBouqet.jpeg";
import SukhnaLake from "../assets/images/SukhnaLae.jpeg";
import Proposal from "../assets/images/Proposal.jpeg";
import BirthdayCake from "../assets/images/BirthdayCake.jpeg";
import BirthdayDinner from "../assets/images/BirthdayDinner.jpeg";
import FirstMonth from "../assets/images/FirstMonth.jpeg";
import OctoberDate from "../assets/images/OctoberDate.jpeg";
import ValentineDate from "../assets/images/ValentineDate.jpeg";
import TrampolineHug from "../assets/images/TrampolineHug.jpeg";
import CafeEyes from "../assets/images/CafeEyes.jpeg";
import Shopping from "../assets/images/Shopping.jpeg";
import Chasmish from "../assets/images/Chasmish.jpeg";
import WhiteCouple from "../assets/images/WhiteCouple.jpeg";

const pages = [
  {
    title: "The Beginning 💖",
    content:
      "Where our beautiful journey started, A love story in the making and a scrapbook of our memories.",
    image: FirstPicture,
  },
  {
    title: "Cute Couple 🌸",
    content: "Kinne sohne lagde ho, jaise koi khwab ho.",
    image: Beginning,
  },
  {
    title: "Our First Date ☕",
    content:
      "A magical moment that sparked our love story and a lot of phools for my jaan.",
    image: FirstBoquet,
  },
  {
    title: "A Little Shy Baby 🐻",
    content: "Uff yeh sharmaana, mera pyara sa baby.",
    image: FirstDate,
  },
  {
    title: "Our first walk 🌅",
    content: "Too shy to hold hands, but our hearts were already connected.",
    image: SukhnaLake,
  },
  {
    title: "Proposal 💍",
    content:
      "I guess you know what this is about, right?, tera woh mixed sa reaction or mera haan k liye wait krna tera hath pakd kar",
    image: Proposal,
  },
  {
    title: "Your Birthday 🎂",
    content:
      "You were glowing and so happy, I’ll never forget the chamkta hua tera chehra and those smiles.",
    image: BirthdayCake,
  },
  {
    title: "Birthday's Lunch 🍽️",
    content:
      "A special day with my special one, celebrating your birthday with love and laughter",
    image: BirthdayDinner,
  },
  {
    title: "First Month Together 🌙",
    content:
      "Celebrating our first month of love and laughter even though we were apart and its all virtual.",
    image: FirstMonth,
  },
  {
    title: "October Date 🍂",
    content:
      "Chehra neend se bhra hua tha but tujhe dekh kr sab thkawat ek pyara chehra dekh kr utar gayi",
    image: OctoberDate,
  },
  {
    title: "Valentine's Day ❤️",
    content:
      "A day filled with love, laughter, and unforgettable moments together.",
    image: ValentineDate,
  },
  {
    title: "Trampoline Fun 🤸‍♀️",
    content:
      "Jumping into love with every bounce even though jump karne bhi nahi ara tha haha",
    image: TrampolineHug,
  },
  {
    title: "Cafe Eyes ☕👀",
    content: "Lost in your eyes over coffee, a moment to cherish forever.",
    image: CafeEyes,
  },
  {
    title: "Shopping Spree 🛍️",
    content:
      "First shopping date, where we bought more memories than things and all those baar baar outfits try krwana terse",
    image: Shopping,
  },
  {
    title: "Chasmish Moments 🤓❤️",
    content: "Your cute glasses make you even more adorable!",
    image: Chasmish,
  },
  {
    title: "White Couple Goals 👩‍❤️‍👨",
    content:
      "Every moment with you is a page in our beautiful story. Can’t wait for the next chapter!",
    image: WhiteCouple,
  },
];

export default function ScrapbookFlipbook() {
  const bookRef = React.useRef();

  const nextPage = () => {
    bookRef.current.pageFlip().flipNext();
  };

  const prevPage = () => {
    bookRef.current.pageFlip().flipPrev();
  };

  return (
    <div className="scrapbook-container flex flex-col items-center gap-6 animate-fade-in px-2 pb-8">
      <HTMLFlipBook
        width={350}
        height={600}
        size="stretch"
        minWidth={300}
        maxWidth={600}
        minHeight={500}
        maxHeight={800}
        maxShadowOpacity={0.5}
        showCover={true}
        mobileScrollSupport={true}
        className="rounded-xl shadow-2xl border-4 border-pink-200 bg-gradient-to-br from-pink-50 to-pink-100"
        ref={bookRef}
      >
        {pages.map((p, i) => (
          <div
            key={i}
            className="scrapbook-page relative w-full h-full p-4 sm:p-6 flex flex-col items-center justify-center text-center overflow-hidden"
          >
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-pink-700 font-cursive mb-3 drop-shadow">
              {p.title}
            </h2>
            <img
              src={p.image}
              alt={p.title}
              className="max-w-full h-auto object-cover rounded-lg shadow-lg border-2 border-pink-300 mx-auto mb-4"
              style={{ maxHeight: "50vh" }}
            />
            <p className="text-sm sm:text-base md:text-lg font-semibold text-pink-700 font-handwritten max-w-xs sm:max-w-sm md:max-w-md leading-snug sm:leading-relaxed mx-auto">
              {p.content}
            </p>
          </div>
        ))}
      </HTMLFlipBook>

      <div className="controls mt-4 flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
        <button
          onClick={prevPage}
          className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full shadow-md transition duration-200 flex items-center justify-center gap-2"
        >
          <ArrowLeft /> <span>Previous</span>
        </button>
        <button
          onClick={nextPage}
          className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-full shadow-md transition duration-200 flex items-center justify-center gap-2"
        >
          <span>Next</span> <ArrowRight />
        </button>
      </div>
    </div>
  );
}
