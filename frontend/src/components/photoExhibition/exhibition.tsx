import { useCallback, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import './exhibition.css';

export interface ExhibitionSlide {
    /** Image source URL. */
    image: string;
    /** Accessible description of the image. Omit when the headline already describes it. */
    alt?: string;
    /** Small uppercase label shown above the headline. */
    eyebrow?: string;
    /** Headline text. */
    title: string;
    /** Supporting paragraph shown below the headline. */
    description?: string;
}

export interface HeroCarouselProps {
    /** Slides to rotate through, in order. */
    slides: ExhibitionSlide[];
    /** Frame aspect ratio as a CSS `aspect-ratio` value (e.g. `"16 / 9"`).
     *  When omitted, the frame is `16 / 9` on desktop/tablet and `4 / 5` on phones. */
    aspectRatio?: string;
    /** Milliseconds each slide stays up while autoplay is enabled. Default `6000`. */
    interval?: number;
    /** Advance slides automatically. Default `true`. */
    autoplay?: boolean;
    /** Show the previous/next arrows. Default `true`. */
    showArrows?: boolean;
    /** Show the `01 / 04` counter. Default `true`. */
    showCounter?: boolean;
    className?: string;
}

const pad = (value: number) => String(value).padStart(2, '0');

export default function ImgExhibition({
    slides,
    aspectRatio,
    interval = 6000,
    autoplay = true,
    showArrows = true,
    showCounter = true,
    className,
}: HeroCarouselProps) {
    const count = slides.length;
    const [index, setIndex] = useState(0);
    const startX = useRef<number | null>(null);

    // Clamp the interval so a bad value can't cause instant spinning.
    const duration = Math.max(250, interval);

    const goTo = useCallback(
        (target: number) => {
            if (count <= 1) return;
            setIndex(((target % count) + count) % count);
        },
        [count]
    );

    const next = useCallback(() => goTo(index + 1), [goTo, index]);
    const prev = useCallback(() => goTo(index - 1), [goTo, index]);

    if (count === 0) return null;

    const active = slides[index];

    const frameStyle = {
        '--hero-interval': `${duration}ms`,
        ...(aspectRatio ? { '--hero-aspect': aspectRatio } : {}),
    } as CSSProperties;

    const rootClass = ['hero-carousel', !autoplay ? 'hero-carousel--static' : '', className ?? '']
        .filter(Boolean)
        .join(' ');

    return (
        <section
            className={rootClass}
            role="region"
            aria-roledescription="carousel"
            aria-label="Featured content"
            onKeyDown={(event) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    prev();
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    next();
                }
            }}
        >
            <div
                className="hero-carousel__frame"
                style={frameStyle}
                onPointerDown={(event) => {
                    startX.current = event.clientX;
                }}
                onPointerUp={(event) => {
                    if (startX.current === null) return;
                    const delta = event.clientX - startX.current;
                    startX.current = null;
                    if (Math.abs(delta) > 40) {
                        if (delta < 0) next();
                        else prev();
                    }
                }}
                onPointerCancel={() => {
                    startX.current = null;
                }}
            >
                {slides.map((slide, i) => (
                    <figure
                        key={`slide-${i}`}
                        className={
                            i === index
                                ? 'hero-carousel__slide hero-carousel__slide--active'
                                : 'hero-carousel__slide'
                        }
                        aria-hidden={i !== index}
                    >
                        <img
                            className="hero-carousel__image"
                            src={slide.image}
                            alt={slide.alt ?? ''}
                            loading={i === 0 ? 'eager' : 'lazy'}
                            draggable={false}
                        />
                    </figure>
                ))}

                <div className="hero-carousel__scrim" aria-hidden="true" />

                {/* ── Text layer ── */}
                <div className="hero-carousel__content" key={`content-${index}`}>
                    {active.eyebrow && <p className="hero-carousel__eyebrow">{active.eyebrow}</p>}
                    <h2 className="hero-carousel__title">{active.title}</h2>
                    {active.description && (
                        <p className="hero-carousel__description">{active.description}</p>
                    )}
                </div>

                {/* ── Status dots ── */}
                {count > 1 && (
                    <div className="hero-carousel__dots" role="group" aria-label="Choose slide">
                        {slides.map((_, i) => {
                            const isActive = i === index;
                            return (
                                <button
                                    key={`dot-${i}`}
                                    type="button"
                                    className={
                                        isActive
                                            ? 'hero-carousel__dot hero-carousel__dot--active'
                                            : 'hero-carousel__dot'
                                    }
                                    onClick={() => goTo(i)}
                                    aria-label={`Go to slide ${i + 1} of ${count}`}
                                    aria-current={isActive ? 'true' : undefined}
                                >
                                    <span className="hero-carousel__dot-pill">
                                        {isActive && autoplay && count > 1 && (
                                            <span
                                                key={`fill-${index}`}
                                                className="hero-carousel__dot-fill"
                                                onAnimationEnd={next}
                                            />
                                        )}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                )}

                {/* ── Index counter ── */}
                {showCounter && count > 1 && (
                    <div className="hero-carousel__counter" aria-hidden="true">
                        <span className="hero-carousel__counter-current">{pad(index + 1)}</span>
                        <span className="hero-carousel__counter-divider">/</span>
                        <span className="hero-carousel__counter-total">{pad(count)}</span>
                    </div>
                )}

                {/* ── Arrows ── */}
                {showArrows && count > 1 && (
                    <>
                        <button
                            type="button"
                            className="hero-carousel__arrow hero-carousel__arrow--prev"
                            onClick={prev}
                            aria-label="Previous slide"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                aria-hidden="true"
                            >
                                <path d="M15 5l-7 7 7 7" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="hero-carousel__arrow hero-carousel__arrow--next"
                            onClick={next}
                            aria-label="Next slide"
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.6"
                                aria-hidden="true"
                            >
                                <path d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </>
                )}
            </div>
        </section>
    );
}
