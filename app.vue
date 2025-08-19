<!-- pages/index.vue -->
<template>
  <UApp>
    <div class="container">
      <main class="wrapper">
        <h1>Квартиры</h1>
        <section class="wrapper-apartament">
          <!-- Шапка таблицы -->
          <div class="wrapper-apartament__header">
            <div class="wrapper-apartament__header-cell hide-mobile">
              <p>Планировка</p>
            </div>

            <div class="wrapper-apartament__header-cell hide-mobile">
              <p>Квартира</p>
            </div>

            <div class="header-cell__group">
              <div
                :class="[
                  'wrapper-apartament__header-cell',
                  store.sortBy === 'area' ? 'active' : '',
                ]"
                @click="store.setSortBy('area')"
              >
                <p>S, м²</p>
                <UICellIcon />
              </div>

              <div
                :class="[
                  'wrapper-apartament__header-cell',
                  store.sortBy === 'price' ? 'active' : '',
                ]"
                @click="store.setSortBy('price')"
              >
                <p>Этаж</p>
                <UICellIcon />
              </div>

              <div
                :class="[
                  'wrapper-apartament__header-cell',
                  store.sortBy === 'floor' ? 'active' : '',
                ]"
                @click="store.setSortBy('floor')"
              >
                <p>Цена, ₽</p>
                <UICellIcon />
              </div>
            </div>
          </div>

          <!-- Список квартир -->
          <div class="wrapper-apartament__list" v-if="!store.isLoading">
            <ApartmentItem
              v-for="apt in store.displayedApartments"
              :item="apt"
            />
          </div>

          <!-- Кнопка "Показать ещё 20" -->
          <button
            v-if="store.hasMore && !store.isLoading"
            @click="store.loadMore"
            class="wrapper-apartament__more-btn"
          >
            Загрузить еще
          </button>

          <!-- Индикатор загрузки -->
          <div v-if="store.isLoading" class="wrapper-apartament__loading">
            <div class="spinner"></div>
          </div>
        </section>

        <div class="wrapper-filter">
          <FilterPanel />
        </div>
      </main>

      <!-- Кнопка "Наверх" -->
      <ScrollToTopButton /></div
  ></UApp>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import { useApartmentsStore } from "~/store/apartments";
import FilterPanel from "~/components/FilterPanel.vue";
import UICellIcon from "~/components/UICellIcon.vue";

const store = useApartmentsStore();

onMounted(() => {
  store.load();
});
</script>

<style lang="scss">
.wrapper {
  margin: 96px 0px;
  display: grid;
  gap: 0 30px;
  grid-template-columns: 1fr 400px;
  grid-template-rows: auto 1fr;

  @media (max-width: 960px) {
    grid-template-columns: 1fr 318px;
    margin: 48px 0px;
  }

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  h1 {
    font-size: 55px;
    font-weight: 700;
    font-family: "PT Root UI";
    margin-bottom: 48px;

    grid-column: 1 / 2;
    grid-row: 1 / 2;

    @media (max-width: 960px) {
      font-size: 54px;
      line-height: 55px;
      margin-bottom: 32px;
    }
  }

  .wrapper-apartament {
    grid-column: 1/2;
    max-width: 800px;
    grid-row: 2/3;

    @media (max-width: 768px) {
      grid-row: 3/4;
    }

    &__loading {
      position: relative;
      width: 100%;
      height: 100%;

      .spinner {
        position: absolute;
        top: 20px;
        left: 50%;

        width: 40px;
        height: 40px;
        border: 4px solid $color-primary;
        border-top: 4px solid transparent; // цвет вращающейся части
        border-radius: 50%;
        animation: loader-spin 1s linear infinite;
      }

      @keyframes loader-spin {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }

    &__header {
      display: grid;
      grid-template-columns: 80px 2fr 3fr;
      padding-bottom: 18px;
      box-shadow: 0px 1px 0px 0px rgba(0, 0, 0, 0.1);

      @media (max-width: 960px) {
        display: flex;
        align-items: center;
        padding-bottom: 12px;
        box-shadow: none;
      }

      p {
        font-weight: 400;
        font-size: 14px;
        line-height: 20px;
      }

      .header-cell__group {
        display: grid;
        gap: 20px;
        grid-template-columns: repeat(3, 1fr);

        @media (max-width: 960px) {
          display: flex;
        }
      }

      .hide-mobile {
        &:nth-child(2) {
          padding-left: 20px;
        }
        @media (max-width: 960px) {
          display: none;
        }
      }

      &-cell {
        display: flex;
        align-items: center;
        gap: 8px;
        cursor: pointer;

        p,
        path {
          transition: all 0.1s;
        }

        &.active {
          svg.active path {
            fill: $color-primary;
          }
          p {
            color: $color-primary;
          }
        }

        .cell-icon {
          display: flex;
          flex-direction: column;
          gap: 2px;
          align-items: center;
        }
      }
    }

    &__more-btn {
      font-weight: 500;
      font-size: 16px;
      line-height: 24px;
      text-align: center;
      border-radius: 25px;
      padding: 8px 24px;
      border: 1px solid rgba(11, 23, 57, 0.2);
      margin-top: 48px;
      transition: all 0.2s ease;

      @media (hover: hover) {
        &:hover,
        &:active {
          color: white;
          background: $color-primary;
        }

        &:active {
          transform: translateY(1px);
        }
      }
    }
  }

  .wrapper-filter {
    grid-column: 2/3;
    grid-row: 1/3;

    @media (max-width: 768px) {
      grid-row: 2/3;
      grid-column: 1/2;
      margin-bottom: 32px;
    }
  }
}
</style>
