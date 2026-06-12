document.addEventListener("DOMContentLoaded", () => {

  /* ─────────────────────────────────────────
     VIDEO CAROUSEL  ("VIDEOS WE'VE MADE")
  ───────────────────────────────────────── */
  const track = document.getElementById('carouselTrack');
  const dotsContainer = document.getElementById('dots');

  if (track && dotsContainer) {
    const cards = track.children;

    // Build dots (one per card)
    for (let i = 0; i < cards.length; i++) {
      const dot = document.createElement('div');
      dot.classList.add('dot');
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => {
        track.scrollTo({ left: cards[i].offsetLeft, behavior: 'smooth' });
      });
      dotsContainer.appendChild(dot);
    }

    // Keep the active dot in sync with scroll position
    track.addEventListener('scroll', () => {
      const dots = dotsContainer.children;
      let closestIndex = 0;
      let closestDist = Infinity;

      for (let i = 0; i < cards.length; i++) {
        const dist = Math.abs(cards[i].offsetLeft - track.scrollLeft);
        if (dist < closestDist) {
          closestDist = dist;
          closestIndex = i;
        }
      }

      for (let i = 0; i < dots.length; i++) {
        dots[i].classList.toggle('active', i === closestIndex);
      }
    });
  }

  // Arrow buttons (called via onclick="scrollCarousel(...)")
  window.scrollCarousel = function (direction) {
    if (!track) return;
    const firstCard = track.children[0];
    if (!firstCard) return;
    const cardWidth = firstCard.getBoundingClientRect().width + 16; // includes gap
    track.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
  };

  /* ─────────────────────────────────────────
     VIDEO PLAYBACK
  ───────────────────────────────────────── */

  // HOVER -> silent preview (muted, plays only while hovered)
  window.hoverPreview = function (thumb, isEntering) {
    const video = thumb.querySelector('video');
    if (!video) return;
    if (thumb.classList.contains('playing')) return; // don't interfere once clicked-to-play

    if (isEntering) {
      video.muted = true;
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
      video.currentTime = 0;
    }
  };

  // CLICK -> start full video with sound (fullscreen on supported devices)
  window.playFull = function (thumb) {
    const video = thumb.querySelector('video');
    if (!video) return;

    thumb.classList.add('playing');
    video.muted = false;
    video.currentTime = 0;
    video.controls = true;
    video.play().catch(() => {});

    if (video.requestFullscreen) {
      video.requestFullscreen().catch(() => {});
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }

    video.addEventListener('ended', () => resetThumb(thumb, video));
    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement) {
        resetThumb(thumb, video);
      }
    });
  };

  function resetThumb(thumb, video) {
    thumb.classList.remove('playing');
    video.controls = false;
    video.muted = true;
    video.pause();
    video.currentTime = 0;
  }

});
