<!-- components/ScrollToTopButton.vue -->
<template>
  <button
    v-show="isVisible"
    @click="scrollToTop"
    class="scroll-to-top"
    aria-label="Наверх"
    role="button"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="15"
      viewBox="0 0 10 15"
      fill="none"
    >
      <path
        d="M5 14.0032L5 2.00317M5 2.00317L9.00063 6.00317M5 2.00317L0.999365 6.00317"
        stroke="white"
        stroke-width="2"
        stroke-linecap="round"
      />
    </svg>
  </button>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";

const isVisible = ref(false);

// Проверяем, насколько прокручена страница
const checkScroll = () => {
  isVisible.value = window.scrollY > 200; // Показываем, если прокручено больше 200px
};

// Плавная прокрутка наверх
const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

onMounted(() => {
  // Устанавливаем обработчик прокрутки
  window.addEventListener("scroll", checkScroll);
  // Проверяем сразу после монтирования
  checkScroll();
});

onBeforeUnmount(() => {
  window.removeEventListener("scroll", checkScroll);
});
</script>

<style lang="scss">
.scroll-to-top {
  background: rgba(149, 208, 161, 1);

  position: fixed;
  bottom: 30px;
  right: 30px;
  width: 40px;
  height: 40px;

  border: none;
  border-radius: 50%;
  cursor: pointer;

  z-index: 100;
  transform: scale(1);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  @media (hover: hover) {
    &:hover {
      background: #3eb57c;
    }
  }

  &:active {
    background: #3eb57c;
  }
}
</style>
