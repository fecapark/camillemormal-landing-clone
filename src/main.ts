import "./style.css";
import gsap from "gsap";
import { debounce, reverseNodeList } from "./utils";

const getSlideAnimation = (type: "center" | "forward" | "backward") => {
  const delay = (() => {
    switch (type) {
      case "center":
        return 0;
      case "forward":
        return 0.4;
      case "backward":
        return 0.3;
      default:
        return undefined;
    }
  })();

  return {
    from: {
      y: type === "backward" ? "-120vh" : "120vh",
    },
    to: {
      y: type === "backward" ? `${scaledContentRect.height / 2}px` : 0,
      duration: 3,
      ease: "expo.inOut",
      stagger: 0.3,
      delay,
    },
  };
};

const resetResponsiveParmeters = () => {
  stageSize = {
    width: document.body.clientWidth,
    height: document.body.clientHeight,
  };
  contentTargetScale = Math.max(
    stageSize.width / contentRect.width,
    stageSize.height / contentRect.height
  );
  scaledContentRect = {
    width: stageSize.width / contentTargetScale,
    height: stageSize.height / contentTargetScale,
  };
};

const contentRect = {
  width: document.querySelector(".content")!.getBoundingClientRect().width,
  height: document.querySelector(".content")!.getBoundingClientRect().height,
};
let stageSize = {
  width: document.body.clientWidth,
  height: document.body.clientHeight,
};
let contentTargetScale = Math.max(
  stageSize.width / contentRect.width,
  stageSize.height / contentRect.height
);
let scaledContentRect = {
  width: stageSize.width / contentTargetScale,
  height: stageSize.height / contentTargetScale,
};

const grid = document.getElementById("grid")!;
const center = document.querySelectorAll(".column.three .item .content");
const forwards = [
  document.querySelectorAll(".column.one .item .content"),
  document.querySelectorAll(".column.five .item .content"),
];
const backwards = [
  reverseNodeList(document.querySelectorAll(".column.four .item .content")),
  reverseNodeList(document.querySelectorAll(".column.two .item .content")),
];

gsap.fromTo(
  center,
  getSlideAnimation("center").from,
  getSlideAnimation("center").to
);

forwards.forEach((forwards) => {
  gsap.fromTo(
    forwards,
    getSlideAnimation("forward").from,
    getSlideAnimation("forward").to
  );
});

backwards.forEach((backwards) => {
  gsap.fromTo(
    backwards,
    getSlideAnimation("backward").from,
    getSlideAnimation("backward").to
  );
});

let isGridScaleAnimateState: "idle" | "animating" | "complete" = "idle";

let gridScaleAnimation = gsap.to(grid, {
  scale: contentTargetScale,
  duration: 4.5,
  ease: "expo.inOut",
  delay: 1.2,
  onStart: () => {
    isGridScaleAnimateState = "animating";
  },
  onComplete: () => {
    isGridScaleAnimateState = "complete";
  },
});

gsap.to(".content.home img", {
  scale: 1,
  duration: 4.5,
  ease: "expo.inOut",
  delay: 1.2,
});

const onResize = () => {
  const prevTargetScale = contentTargetScale;
  resetResponsiveParmeters();

  if (isGridScaleAnimateState === "animating") {
    const progress = gridScaleAnimation.progress();
    gridScaleAnimation.kill();

    gridScaleAnimation = gsap.fromTo(
      grid,
      {
        scale: contentTargetScale / prevTargetScale,
      },
      {
        scale: contentTargetScale,
        duration: 4.5,
        ease: "expo.inOut",
        delay: 1.2,
        onComplete: () => {
          isGridScaleAnimateState = "complete";
        },
      }
    );
    gridScaleAnimation.time(4.5 * progress);
  } else if (isGridScaleAnimateState === "complete") {
    grid.style.transform = `scale(${contentTargetScale})`;
  }

  requestAnimationFrame(() => {
    const homes = document.querySelectorAll<HTMLDivElement>(".content")!;
    homes.forEach((home) => {
      home.style.width = `${scaledContentRect.width}px`;
      home.style.height = `${scaledContentRect.height}px`;
    });
  });
};

window.addEventListener("resize", debounce(onResize, 100));
onResize();
