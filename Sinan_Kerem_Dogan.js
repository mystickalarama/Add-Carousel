(() => {

  const productPage = document.querySelector(".product-detail");
  if (!productPage) return;

  const fetchProducs = async () => {
    try {
      const response = await fetch("https://gist.githubusercontent.com/sevindi/5765c5812bbc8238a38b3cf52f233651/raw/56261d81af8561bf0a7cf692fe572f9e1e91f372/products.json");
      const products = await response.json();
      localStorage.setItem("products", JSON.stringify(products));
      return products;
    } catch (error) {
      console.log("Fail to fetch products", error);
    }
  };

  const getProducts = async () => {
    const cachedProducts = localStorage.getItem("products");
    if (cachedProducts) return JSON.parse(cachedProducts);
    return await fetchProducs();
  };

  const markFavorites = () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    $(".carousel-item").each(function () {
      const productId = $(this).data("id");
      if (favorites.includes(productId)) {
        $(this).find(".heart-icon").addClass("filled");
      }
    });
  };

  const init = async () => {
    await buildHTML();
    buildCSS();
    setEvents();
    enableDragScroll();
  };

  const buildHTML = async () => {
    const products = await getProducts();

    const html = `
      <div class="carousel-box">
      <div class="carousel-container">
        <h2 class="carousel-title">You Might Also Like</h2>
        <div class="carousel-wrapper">
          <button class="carousel-prev">
          <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
          </button>
          <div class="carousel">
            ${products
              .map(
                (product) => `
              <div class="carousel-item" data-id="${product.id}" data-url="${product.url}">
                <img src="${product.img}" alt="${product.name}">
                <div class="name-box">
                <p>${product.name}</p>
                <div class="price-box"><span class="price-area">${product.price} TL</span></div>
                </div>
                <span class="heart-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20.576" height="19.483" viewBox="0 0 20.576 19.483"><path fill="none" stroke="#555" stroke-width="1.5px" d="M19.032 7.111c-.278-3.063-2.446-5.285-5.159-5.285a5.128 5.128 0 0 0-4.394 2.532 4.942 4.942 0 0 0-4.288-2.532C2.478 1.826.31 4.048.032 7.111a5.449 5.449 0 0 0 .162 2.008 8.614 8.614 0 0 0 2.639 4.4l6.642 6.031 6.755-6.027a8.615 8.615 0 0 0 2.639-4.4 5.461 5.461 0 0 0 .163-2.012z" transform="translate(.756 -1.076)"></path></svg>
                </span>
              </div>
            `
              )
              .join("")}
          </div>
          <button class="carousel-next">
          <svg xmlns="http://www.w3.org/2000/svg" width="14.242" height="24.242" viewBox="0 0 14.242 24.242"><path fill="none" stroke="#333" stroke-linecap="round" stroke-width="3px" d="M2106.842 2395.467l-10 10 10 10" transform="translate(-2094.721 -2393.346)"></path></svg>
          </button>
        </div>
      </div>
      </div>
    `;

    $(".product-detail").append(html);
    markFavorites();
  };

  const buildCSS = () => {
    const css = `
      .carousel-box {
        display: flex;
        justify-content: center;
      }

      .carousel-container {
        margin: 20px auto 0 auto;
        padding: 15px;
        background: #f9f9f9;
        width: 80%;
      }

      .carousel-title {
        font-size: 24px;
        color: #29323b;
        line-height: 33px;
        font-weight: lighter;
        padding: 15px 0;
        margin: 0;
      }

      .carousel-wrapper {
        display: flex;
        align-items: center;
        gap: 10px;
        overflow: hidden;
        margin: 0 auto;
      }

      .carousel {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        scroll-behavior: smooth;
      }

      .carousel-item {
        flex: 0 0 19rem;
        background: white;
        text-align: start;
        cursor: pointer;
        position: relative;
      }

      .carousel-item img {
        width: 100%;
      }

      .name-box {
        display: flex;
        flex-direction: column;
        padding: 0 10px;
      }

      .name-box p {
        font-size: 14px;
        margin-top: 5px;
        height: 40px;
      }

      .price-box {
        display: flex;
        align-items: flex-start;
        height: 50px;
        flex-direction: column;
      }

      .price-area {
        font-size: 18px;
        color: #193db0;
        font-weight: bold;
        display: inline-block;

        margin-top: 5px;
      }

      .heart-icon {
        cursor: pointer;
        position: absolute;
        top: 9px;
        right: 15px;
        width: 34px;
        height: 34px;
        background-color: #fff;
        border-radius: 5px;
        box-shadow: 0 3px 6px 0 rgba(0,0,0,.16);
        border: solid .5px #b6b7b9;
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .heart-icon.filled path {
        stroke: #193db0;
        fill: #193db0;
      }

      .carousel-prev, .carousel-next {
        width: 20px;
        height: 35px;
        cursor: pointer;
        border: none;
        background: none;
      }

      .carousel-next svg {
        transform: rotate(180deg);
      }

      @media (max-width: 1024px) {
      .carousel-container {
        width: 100%;
      }

      .carousel-wrapper {
        overflow-x: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
        overflow: hidden;
      }

      .carousel-wrapper::-webkit-scrollbar {
        display: none;
      }

      .carousel {
        gap: 10px;
      }

      .carousel-item {
        flex: 0 0 28rem;
      }

      .carousel-prev,
      .carousel-next {
        display: none;
      }
    `;

    $("<style>").addClass("carousel-style").html(css).appendTo("head");
  };

  const setEvents = () => {
    $(document).on("click", ".carousel-item", function (e) {
      if (!$(e.target).closest(".heart-icon").length) {
        window.open($(this).data("url"), "_blank");
      }
    });

    $(document).on("click", ".heart-icon", function (e) {
      e.stopPropagation();
      $(this).toggleClass("filled");

      const productId = $(this).closest(".carousel-item").data("id");
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];

      if ($(this).hasClass("filled")) {
        if (!favorites.includes(productId)) favorites.push(productId);
      } else {
        favorites = favorites.filter((id) => id !== productId);
      }

      localStorage.setItem("favorites", JSON.stringify(favorites));
    });

    $(".carousel-prev").on("click", () => {
      $(".carousel").animate({ scrollLeft: "-=200" }, 300);
    });

    $(".carousel-next").on("click", () => {
      $(".carousel").animate({ scrollLeft: "+=200" }, 300);
    });
  };

  const enableDragScroll = () => {
    const carousel = document.querySelector(".carousel");
    let isDown = false;
    let startX, scrollLeft;
    let velocity = 0;
    let lastMoveX = 0;
    let lastTime = 0;
    let momentumID;

    const stopMomentum = () => cancelAnimationFrame(momentumID);

    const applyMomentum = () => {
      if (Math.abs(velocity) < 0.1) return;
      carousel.scrollLeft += velocity;
      velocity *= 0.95;
      momentumID = requestAnimationFrame(applyMomentum);
    };

    const startDragging = (clientX) => {
      isDown = true;
      startX = clientX;
      scrollLeft = carousel.scrollLeft;
      velocity = 0;
      stopMomentum();
      carousel.classList.add("dragging");
      document.body.style.userSelect = "none";
      lastMoveX = clientX;
      lastTime = Date.now();
    };

    const moveDragging = (clientX) => {
      if (!isDown) return;
      const x = clientX;
      const walk = (x - startX) * 1.5;
      carousel.scrollLeft = scrollLeft - walk;

      const now = Date.now();
      velocity = (x - lastMoveX) / (now - lastTime);
      lastMoveX = x;
      lastTime = now;
    };

    const stopDragging = () => {
      isDown = false;
      carousel.classList.remove("dragging");
      document.body.style.userSelect = "";
      applyMomentum();
    };

    carousel.addEventListener("mousedown", (e) => startDragging(e.pageX));
    carousel.addEventListener("mousemove", (e) => moveDragging(e.pageX));
    document.addEventListener("mouseup", stopDragging);
    document.addEventListener("mouseleave", stopDragging);

    carousel.addEventListener("touchstart", (e) =>
      startDragging(e.touches[0].pageX)
    );
    carousel.addEventListener("touchmove", (e) =>
      moveDragging(e.touches[0].pageX)
    );
    carousel.addEventListener("touchend", stopDragging);
  };

  init();
})();
