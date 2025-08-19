<template>
  <article class="appart-item">
    <div class="appart-item__img">
      <picture>
        <source srcset="/Image.webp" media="(orientation: portrait)" />
        <img src="/Image.png" :alt="item.title" />
      </picture>
    </div>
    <div class="appart-item__title">
      <h2>{{ item.title }}</h2>
    </div>

    <div class="appart-item__content">
      <p class="appart-item__area">
        {{ item.area }}<span class="value">&nbsp;м²</span>
      </p>
      <p class="appart-item__floor">
        {{ item.floor }}<span> из {{ item.totalFloors }} </span>
        <span class="value">&nbsp;этаж</span>
      </p>
      <p class="appart-item__price">
        {{ formatPrice(item.price) }}<span class="value">&nbsp;₽</span>
      </p>
    </div>
  </article>
</template>

<script lang="ts" setup>
import { type IApartment } from "~/types/IApartment";
import { formatPrice } from "~/utils/formatPrice";

const props = defineProps<{
  item: IApartment;
}>();
</script>

<style lang="scss">
.appart-item {
  display: grid;
  grid-template-columns: 80px 2fr 3fr;
  box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);
  padding: 16px 0 24px;

  @media (max-width: 960px) {
    grid-template-columns: repeat(3, auto) 80px;
    gap: 20px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: none;
    border-radius: 8px;
    margin-bottom: 4px;
    padding: 16px 24px;
  }

  h2 {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }

  p {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;

    .value {
      @media (min-width: 961px) {
        display: none;
      }
    }

    &.appart-item__floor {
      span {
        font-weight: 400;
        font-size: 16px;
        line-height: 24px;
        color: #848a9b;
      }
    }
  }

  &__content {
    display: grid;
    grid-template-columns: repeat(3, 1fr);

    @media (max-width: 960px) {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
  }

  &__title {
    margin-left: 20px;
    @media (max-width: 960px) {
      margin-left: 0;
      grid-column: 1/4;
      grid-row: 1/2;
    }
  }

  &__img {
    @media (max-width: 960px) {
      grid-column: 4/5;
      grid-row: 1/3;
      display: flex;
      justify-content: end;
    }

    img {
      aspect-ratio: 1 / 1;
      width: 100%;
      max-width: 80px;
    }
  }
}
</style>
